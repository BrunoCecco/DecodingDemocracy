from flask import Blueprint, jsonify
from db import get_db_connection

bp = Blueprint('consultations', __name__, url_prefix='/api/consultations')

@bp.route('/', methods=['GET'])
def consultations():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM Consultation')
    consultations = c.fetchall()
    conn.close()
    return jsonify(consultations)

@bp.route('/<int:consultation_id>', methods=['GET'])
def consultation(consultation_id):
    conn = get_db_connection()
    c = conn.cursor()    
    c.execute('SELECT * FROM Consultation WHERE id = ?', (consultation_id,))
    consultation = c.fetchone()    
    conn.close()
    return jsonify(consultation)