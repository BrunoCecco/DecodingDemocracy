from flask import Blueprint, jsonify, request
from db import get_db_connection
import matplotlib
matplotlib.use('Agg')  # Use Agg backend for plotting (non-interactive)

import matplotlib.pyplot as plt
import io
import base64
bp = Blueprint('topics', __name__, url_prefix='/api/topics')

# get topics for a given question (topic_id)
@bp.route('/<string:question_id>', methods=['GET'])
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

# get most common topics and average sentiment for each topic for a given question (topic_id)
@bp.route('/common/<string:question_id>', methods=['GET'])
def common_topics(question_id):    
    conn = get_db_connection()
    c = conn.cursor()  
    limit = request.args.get('limit', type=int)  # Ensure 'limit' is an integer
    c.execute('''SELECT T.topic_id, ROUND(AVG(R.sentiment_value),3) as average_sentiment, COUNT(R.topic_id) as topic_count
                FROM Topics T
                JOIN Response R ON T.topic_id = R.topic_id
                WHERE R.question_id = ?
                GROUP BY T.topic_id
                ORDER BY topic_count DESC, average_sentiment DESC
                LIMIT ?                
                ''', (question_id, limit))
    topics = c.fetchall()    
    conn.close()
    print(topics)
    return jsonify(topics)

# get most common words and their scores in a topic
@bp.route('/topwords/<string:topic_id>', methods=['GET'])
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

@bp.route('/search/<string:question_id>/<string:topic_id>', methods=['GET'])
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
def num_responses(topic_id):
    conn = get_db_connection()
    c = conn.cursor()    
    print(topic_id)
    c.execute('SELECT COUNT(*) as topic_count FROM Response WHERE topic_id = ?', (topic_id,))
    count = c.fetchone()
    conn.close()
    return jsonify(count)

# get average sentiment for a given topic
@bp.route('/averagesentiment/<string:topic_id>', methods=['GET'])
def average_sentiment(topic_id):
    conn = get_db_connection()
    c = conn.cursor()    
    print(topic_id, 'topic_od')
    c.execute('SELECT ROUND(AVG(sentiment_value),3) as average_sentiment FROM Response WHERE topic_id = ?', (topic_id,))
    average_sentiment = c.fetchone()
    conn.close()
    return jsonify(average_sentiment)