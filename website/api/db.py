import sqlite3
import os
DB_PATH = os.environ.get('DB_PATH')
print(DB_PATH, "DB_PATH")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, DB_PATH)

def dict_factory(cursor, row):
    fields = [column[0] for column in cursor.description]
    return {key: value for key, value in zip(fields, row)}

def get_db_connection():
    conn = sqlite3.connect(db_path)
    conn.row_factory = dict_factory
    return conn