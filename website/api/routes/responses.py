from flask import Blueprint, jsonify, request
from db import get_db_connection
from routes.utils import semantic_similarity_text, pre_process, stopwords
import numpy as np
from sentence_transformers import SentenceTransformer

bp = Blueprint('responses', __name__, url_prefix='/api/responses')
model = SentenceTransformer('all-MiniLM-L6-v2')

@bp.route('/<int:responder_id>', methods=['GET'])
def responses(responder_id):
    conn = get_db_connection()
    c = conn.cursor()    
    c.execute('SELECT * FROM Response WHERE responder_id = ?', (responder_id,))
    responses = c.fetchall()    
    conn.close()
    return jsonify(responses)

# /api/responses/{question_id}?offset=0&limit=10
@bp.route('/<string:question_id>', methods=['GET'])
def response(question_id):    
    conn = get_db_connection()
    c = conn.cursor()    
    offset = request.args.get('offset')
    limit = request.args.get('limit')
    c.execute('SELECT * FROM Response WHERE question_id = ? AND response IS NOT NULL LIMIT ? OFFSET ?', (question_id, limit, offset))
    response = c.fetchall()    
    conn.close()
    return jsonify(response)

@bp.route('/search/<string:question_id>/<string:search_term>', methods=['GET'])
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

# get most similar response by using cosine similarity
@bp.route('/similar/<string:question_id>/<string:text>', methods=['GET'])
def similar_responses(question_id, text):
    conn = get_db_connection()
    c = conn.cursor()
    offset = int(request.args.get('offset')) if request.args.get('offset') else 0
    limit = int(request.args.get('limit')) if request.args.get('limit') else 10
    c.execute('''
        SELECT response_embeddings as embeddings FROM Question
        WHERE id = ?''', (question_id,))
    res = c.fetchone()    
    # Convert embedding to numpy array
    response_embeddings = np.frombuffer(res['embeddings'], dtype=np.float32)

    c.execute('''
        SELECT MIN(id) as id FROM Response
        WHERE question_id = ?''', (question_id,))
    first_resp_id = c.fetchone()    
    
    preprocessed = " ".join(pre_process(text,stopwords))
    emb = model.encode(preprocessed, convert_to_tensor=True)
    emb = emb.cpu().numpy()

    # Reshape array of all response embeddings
    items_per_subarray = emb.shape[0]
    num_subarrays = len(response_embeddings) // items_per_subarray
    reshaped_embeddings = response_embeddings[:num_subarrays * items_per_subarray].reshape((num_subarrays, items_per_subarray))

    result_df = semantic_similarity_text(emb, reshaped_embeddings)

    responses = []    
    for index, row in result_df.iterrows():
        responses.append({'id': int(row['id']) + int(first_resp_id['id']), 'similarity_score': row['score']})
    
    ret = []
    for i in range(offset, offset+limit):            
        response_id = responses[i]['id']
        c.execute('SELECT * FROM Response WHERE id = ?', (response_id,))
        resp = c.fetchone()
        resp_object = {'similarity_score': responses[i]['similarity_score']}
        for key in resp.keys():
            resp_object[key] = resp[key]
        ret.append(resp_object)    
    conn.close()
    return jsonify(ret)