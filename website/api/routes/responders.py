from flask import Blueprint, jsonify
from api.db import get_db_connection
from functools import lru_cache # to cache the results of the functions

bp = Blueprint('responders', __name__, url_prefix='/api/responders')

"""
Define routes for retrieving all responders and a specific responder by ID.
@route GET '/' - retrieve all responders from the database.
@route GET '/<int:responder_id>' - retrieve a specific responder based on the responder_id.
"""

# get all responders   
@bp.route('/', methods=['GET'])   
@lru_cache(maxsize=32) 
def responders():
    conn = get_db_connection()
    c = conn.cursor()    
    c.execute('SELECT * FROM Responder')
    responders = c.fetchall()    
    conn.close()
    return jsonify(responders)

# get a specific responder based on its ID
@bp.route('/<int:responder_id>', methods=['GET'])
@lru_cache(maxsize=32)
def responder(responder_id):
    conn = get_db_connection()
    c = conn.cursor()    
    c.execute('SELECT * FROM Responder WHERE id = ?', (responder_id,))
    responder = c.fetchone()    
    conn.close()
    return jsonify(responder)