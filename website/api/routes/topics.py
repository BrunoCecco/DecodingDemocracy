from flask import Blueprint, jsonify, request
from db import get_db_connection
from functools import lru_cache # to cache the results of the functions

bp = Blueprint('topics', __name__, url_prefix='/api/topics')

# get topics for a given question (topic_id)
@bp.route('/<string:question_id>', methods=['GET'])
@lru_cache(maxsize=32)
def topics(question_id):    
    conn = get_db_connection()
    c = conn.cursor()      
    c.execute('''SELECT T.topic_id, COUNT(R.topic_id) as topic_count
                FROM Topics T   
                JOIN Response R ON T.topic_id = R.topic_id
                WHERE R.question_id = ?
                GROUP BY T.topic_id
                ORDER BY topic_count DESC
                ''', (question_id,))
    topics = c.fetchall()    
    conn.close()
    return jsonify(topics)

# get most common topics for a given question
@bp.route('/common/<string:question_id>', methods=['GET'])
@lru_cache(maxsize=32)
def common_topics(question_id):    
    conn = get_db_connection()
    c = conn.cursor()  
    limit = request.args.get('limit', type=int)  # Ensure 'limit' is an integer
    c.execute('''SELECT T.topic_id, COUNT(R.topic_id) as topic_count
                FROM Topics T
                JOIN Response R ON T.topic_id = R.topic_id
                WHERE R.question_id = ?
                GROUP BY T.topic_id
                ORDER BY topic_count DESC
                LIMIT ?                
                ''', (question_id, limit))
    topics = c.fetchall()    
    conn.close()
    print(topics)
    return jsonify(topics)

# get most common words and their scores in a topic
@bp.route('/topwords/<string:topic_id>', methods=['GET'])
@lru_cache(maxsize=32)
def top_words(topic_id):    
    conn = get_db_connection()
    c = conn.cursor()  
    limit = request.args.get('limit', type=int)  # Ensure 'limit' is an integer
    c.execute('''SELECT word, word_value
              FROM TopicWords 
              WHERE topic_id = ?
              ORDER BY CAST(word_value AS REAL) DESC
                LIMIT ?
            ''', (topic_id, limit))
    top_words = c.fetchall()
    conn.close()
    return jsonify(top_words)

# search for responses within a given topic
@bp.route('/search/<string:question_id>/<string:topic_id>', methods=['GET'])
@lru_cache(maxsize=32)
def search_responses(question_id, topic_id):
    conn = get_db_connection()
    c = conn.cursor()
    offset = request.args.get('offset')
    limit = request.args.get('limit')
    c.execute('SELECT * FROM Response WHERE question_id = ? AND topic_id = ? LIMIT ? OFFSET ?', (question_id, topic_id, limit, offset))
    responses = c.fetchall()
    conn.close()
    return jsonify(responses)

# get number of responses for a given topic
@bp.route('/numresponses/<string:topic_id>', methods=['GET'])
@lru_cache(maxsize=32)
def num_responses(topic_id):
    conn = get_db_connection()
    c = conn.cursor()    
    print(topic_id)
    c.execute('SELECT COUNT(*) as topic_count FROM Response WHERE topic_id = ?', (topic_id,))
    count = c.fetchone()
    conn.close()
    return jsonify(count)

# get sentiment distribution for a given topic
@bp.route('/sentiment/<string:topic_id>', methods=['GET'])
@lru_cache(maxsize=32)
def average_sentiment(topic_id):
    conn = get_db_connection()
    c = conn.cursor()    
    c.execute('''SELECT SUM(CASE WHEN sentiment_value > 0 THEN sentiment_value ELSE 0 END) AS positive,
            SUM(CASE WHEN sentiment_value < 0 THEN sentiment_value ELSE 0 END) AS negative
            FROM Response
            WHERE topic_id = ?''', (topic_id,))    
    sentiment = c.fetchall()    
    conn.close()
    return jsonify(sentiment[0])