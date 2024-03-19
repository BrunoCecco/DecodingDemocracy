import sqlite3
import os
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2') # Load pre-trained sentence transformer model

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, 'db.sqlite')

# Custom row factory to return rows as dictionaries
def dict_factory(cursor, row):
    fields = [column[0] for column in cursor.description]
    return {key: value for key, value in zip(fields, row)}

# Get a connection to the database
def get_db_connection():
    conn = sqlite3.connect(db_path)
    conn.row_factory = dict_factory
    return conn