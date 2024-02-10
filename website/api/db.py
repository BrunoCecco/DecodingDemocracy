import sqlite3
import os
DB_PATH = os.environ.get('DB_PATH')
print(DB_PATH, "DB_PATH")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, DB_PATH)

def get_db_connection():
    conn = sqlite3.connect(db_path)
    # conn.row_factory = sqlite3.Row
    return conn