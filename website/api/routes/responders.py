from flask import Blueprint, jsonify
from db import get_db_connection

bp = Blueprint('responders', __name__, url_prefix='/api/responders')

"""
Define routes for retrieving all responders and a specific responder by ID.
@route GET '/' - retrieve all responders from the database.
@route GET '/<int:responder_id>' - retrieve a specific responder based on the responder_id.
"""

# get all responders   
@bp.route('/', methods=['GET'])    
def responders():
    conn = get_db_connection()
    c = conn.cursor()    
    c.execute('SELECT * FROM Responder')
    responders = c.fetchall()    
    conn.close()
    return jsonify(responders)

# get a specific responder based on its ID
@bp.route('/<int:responder_id>', methods=['GET'])
def responder(responder_id):
    conn = get_db_connection()
    c = conn.cursor()    
    c.execute('SELECT * FROM Responder WHERE id = ?', (responder_id,))
    responder = c.fetchone()    
    conn.close()
    return jsonify(responder)