import os
import sqlite3
from flask import Flask

app = Flask(__name__)
app.config["SECRET_KEY"] = "dev"

# Path to database
BASE_DIR = os.path.dirname(__file__)
DATABASE = os.path.join(BASE_DIR, "wealthwise.db")

def db():
    # Return a fresh SQLite connection.
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


# Init DB

@app.cli.command("init-db")
def init_db():
    # Run: flask init-db
    conn = db()
    schema_path = os.path.join(BASE_DIR, "schema.sql")
    with open(schema_path, "r", encoding="utf-8") as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()
    print("Initialized database!")


# Allow running with python app.py
if __name__ == "__main__":
    app.run(debug=True)