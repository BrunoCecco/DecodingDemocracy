from flask import Blueprint, jsonify, request
from db import get_db_connection
from routes.utils import semantic_similarity_text, pre_process, stopwords
import numpy as np
from sentence_transformers import SentenceTransformer
from functools import lru_cache # to cache the results of the functions

bp = Blueprint('responses', __name__, url_prefix='/api/responses')
model = SentenceTransformer('all-MiniLM-L6-v2') # Load pre-trained sentence transformer model

# get all responses for a given responder
@bp.route('/<int:responder_id>', methods=['GET'])
@lru_cache(maxsize=32)
def responses(responder_id):
    conn = get_db_connection()
    c = conn.cursor()    
    c.execute('SELECT * FROM Response WHERE responder_id = ?', (responder_id,))
    responses = c.fetchall()    
    conn.close()
    return jsonify(responses)

# get all responses for a given question, with offset and limit
@bp.route('/<string:question_id>', methods=['GET'])
@lru_cache(maxsize=32)
def response(question_id):    
    conn = get_db_connection()
    c = conn.cursor()    
    offset = request.args.get('offset')
    limit = request.args.get('limit')
    c.execute('SELECT * FROM Response WHERE question_id = ? AND response IS NOT NULL LIMIT ? OFFSET ?', (question_id, limit, offset))
    response = c.fetchall()    
    conn.close()
    return jsonify(response)

# search for responses containing a specific term
@bp.route('/search/<string:question_id>/<string:search_term>', methods=['GET'])
@lru_cache(maxsize=32)
def search_responses(question_id, search_term):
    conn = get_db_connection()
    c = conn.cursor()
    offset = request.args.get('offset')
    limit = request.args.get('limit')
    c.execute('SELECT * FROM Response WHERE question_id = ? AND response LIKE ? LIMIT ? OFFSET ?', (question_id, '%' + search_term + '%', limit, offset))
    responses = c.fetchall()
    conn.close()
    return jsonify(responses)

# get overall sentiment distribution for a given question
@bp.route('/sentiment/<string:question_id>', methods=['GET'])
@lru_cache(maxsize=32)
def sentiment_distribution(question_id):    
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''SELECT SUM(CASE WHEN sentiment_value > 0 THEN sentiment_value ELSE 0 END) AS positive,
                SUM(CASE WHEN sentiment_value < 0 THEN sentiment_value ELSE 0 END) AS negative
                FROM Response
                WHERE question_id = ?''', (question_id,))
    res = c.fetchone()
    conn.close()    
    return jsonify(res)

# get multiplce choice options and their counts for a given question
@bp.route('/multiplechoice/<string:question_id>', methods=['GET'])
@lru_cache(maxsize=32)
def multiple_choice(question_id):    
    conn = get_db_connection()
    c = conn.cursor()        
    c.execute('''SELECT response, COUNT(response) as response_count
                FROM Response
                WHERE question_id = ? AND response IS NOT NULL
                GROUP BY response
                ORDER BY response_count DESC
                ''', (question_id,))
    multiple_choice = c.fetchall()       
    # get number of null responses
    c.execute('''SELECT COUNT(*) as count FROM Response WHERE question_id = ? AND response IS NULL''' , (question_id,))
    null_responders = c.fetchall()    
    noresponse_dict = {'response': 'No Response', 'response_count': null_responders[0]['count']}
    multiple_choice.append(noresponse_dict)
    conn.close()    
    return jsonify(multiple_choice)

"""
Retrieve similar responses to a given question based on the text input, using cosine similarity.
@param question_id - The ID of the question for which we want to find similar responses.
@param text - The text input for which we want to find similar responses.
@return A JSON response containing similar responses along with their similarity scores.
"""
@bp.route('/similar/<string:question_id>/<string:text>', methods=['GET'])
@lru_cache(maxsize=32)
def similar_responses(question_id, text):
    conn = get_db_connection()
    c = conn.cursor()
    offset = int(request.args.get('offset')) if request.args.get('offset') else 0
    limit = int(request.args.get('limit')) if request.args.get('limit') else 10
    c.execute('''
        SELECT response_embeddings as embeddings FROM Question
        WHERE id = ?''', (question_id,))
    res = c.fetchone() # response embeddings are stored as a blob in the database
    # Convert embeddings to numpy array so we can use them for similarity comparison
    response_embeddings = np.frombuffer(res['embeddings'], dtype=np.float32)

    c.execute('''
        SELECT MIN(id) as id FROM Response
        WHERE question_id = ?''', (question_id,))
    first_resp_id = c.fetchone() # get the first response ID for the question to use as an offset
    
    preprocessed = " ".join(pre_process(text,stopwords)) # Preprocess the input text
    emb = model.encode(preprocessed, convert_to_tensor=True) # Get the embeddings for the input text
    emb = emb.cpu().numpy()

    # Reshape array of all response embeddings so we can compare the input text to each response
    items_per_subarray = emb.shape[0]
    num_subarrays = len(response_embeddings) // items_per_subarray
    reshaped_embeddings = response_embeddings[:num_subarrays * items_per_subarray].reshape((num_subarrays, items_per_subarray))

    result_df = semantic_similarity_text(emb, reshaped_embeddings) # Get the similarity scores for the input text and each response

    responses = []    
    for index, row in result_df.iterrows(): # Convert the similarity scores to a list of dictionaries
        responses.append({'id': int(row['id']) + int(first_resp_id['id']), 'similarity_score': row['score']})
    
    ret = []
    for i in range(offset, offset+limit): # only return the responses within the offset and limit          
        response_id = responses[i]['id'] # Get the response ID for each response
        c.execute('SELECT * FROM Response WHERE id = ?', (response_id,)) # Get the full response from db using the response ID
        resp = c.fetchone()
        resp_object = {'similarity_score': responses[i]['similarity_score']}
        for key in resp.keys():
            resp_object[key] = resp[key]
        ret.append(resp_object)    
    conn.close()
    return jsonify(ret)