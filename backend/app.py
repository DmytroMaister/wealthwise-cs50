import os
import sqlite3
from functools import wraps

from flask import Flask, request, jsonify, session, g
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

# Path to the SQLite database file
BASE_DIR = os.path.dirname(__file__)
DATABASE = os.path.join(BASE_DIR, "wealthwise.db")

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-key")
app.config["JSON_AS_ASCII"] = False

# Allow requests from the frontend and support cookies (session)
CORS(app, supports_credentials=True)




if __name__ == "__main__":
    # First time:
    #   flask --app app.py init-db
    # Then:
    #   flask --app app.py run
    app.run(debug=True)