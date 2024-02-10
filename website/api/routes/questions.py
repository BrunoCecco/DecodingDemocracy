from flask import Blueprint, jsonify
from db import get_db_connection

bp = Blueprint('questions', __name__, url_prefix='/api/questions')

@bp.route('/<int:consultation_id>', methods=['GET'])
def questions(consultation_id):
    conn = get_db_connection()
    c = conn.cursor()    
    c.execute('SELECT id, consultation_id, question, multiplechoice FROM Question WHERE consultation_id = ?', (consultation_id,))
    questions = c.fetchall()    
    conn.close()
    return jsonify(questions)

@bp.route('/<string:question_id>', methods=['GET'])
def question(question_id):
    conn = get_db_connection()
    c = conn.cursor()    
    c.execute('SELECT id, consultation_id, question, multiplechoice FROM Question WHERE id = ?', (question_id,))
    question = c.fetchone()    
    conn.close()
    return jsonify(question)

# wordcloud for a given question
@bp.route('/wordcloud/<string:question_id>', methods=['GET'])
def wordcloud(question_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT wordcloud FROM Question WHERE id = ?', (question_id,))
    wordcloud = c.fetchone()[0]
    conn.close()
    return wordcloud
    
    