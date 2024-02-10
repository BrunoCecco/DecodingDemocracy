from flask import Blueprint, jsonify
from db import get_db_connection

bp = Blueprint('responders', __name__, url_prefix='/api/responders')

@bp.route('/', methods=['GET'])
def responders():
    conn = get_db_connection()
    c = conn.cursor()    
    c.execute('SELECT * FROM Responder')
    responders = c.fetchall()    
    conn.close()
    return jsonify(responders)

@bp.route('/<int:responder_id>', methods=['GET'])
def responder(responder_id):
    conn = get_db_connection()
    c = conn.cursor()    
    c.execute('SELECT * FROM Responder WHERE id = ?', (responder_id,))
    responder = c.fetchone()    
    conn.close()
    return jsonify(responder)