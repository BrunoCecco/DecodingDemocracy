from flask import Blueprint, jsonify
from db import get_db_connection

bp = Blueprint('consultations', __name__, url_prefix='/api/consultations')


"""
Define routes for retrieving consultations from the database.
- For the route '/', retrieve all consultations from the database.
- For the route '/<int:consultation_id>', retrieve a specific consultation based on the consultation_id.
"""

# get all consultations
@bp.route('/', methods=['GET'])
def consultations():        
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM Consultation')
    consultations = c.fetchall()
    conn.close()
    return jsonify(consultations)

# get a specific consultation based on its ID
@bp.route('/<int:consultation_id>', methods=['GET'])
def consultation(consultation_id):
    conn = get_db_connection()
    c = conn.cursor()    
    c.execute('SELECT * FROM Consultation WHERE id = ?', (consultation_id,))
    consultation = c.fetchone()    
    conn.close()
    return jsonify(consultation)