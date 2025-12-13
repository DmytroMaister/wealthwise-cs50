import os
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from cs50 import SQL
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config["SECRET_KEY"] = "dev"

# If React runs on Vite (5173)
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

# Connect Database
BASE_DIR = os.path.dirname(__file__)
db = SQL(f"sqlite:///{os.path.join(BASE_DIR, 'wealthwise.db')}")


@app.post("/api/register")
def register():
    username = (request.form.get("username") or "").strip()
    password = request.form.get("password") or ""
    confirmation = request.form.get("confirmation") or ""

    if not username or not password or not confirmation:
        return jsonify({"error": "all fields are required"}), 400

    if password != confirmation:
        return jsonify({"error": "passwords do not match"}), 400

    if len(password) < 8:
        return jsonify({"error": "password must be at least 8 characters"}), 400

    rows = db.execute(
        "SELECT id FROM users WHERE username = ?",
        username,
    )
    if rows:
        return jsonify({"error": "username already taken"}), 400

    hashed = generate_password_hash(password)
    db.execute(
        "INSERT INTO users (username, hash) VALUES (?, ?)",
        username,
        hashed,
    )

    user_id = db.execute(
        "SELECT id FROM users WHERE username = ?",
        username,
    )[0]["id"]

    session["user_id"] = user_id

    return jsonify({
        "id": user_id,
        "username": username
    })


@app.post("/api/login")
def login():
    username = (request.form.get("username") or "").strip()
    password = request.form.get("password") or ""

    if not username or not password:
        return jsonify({"error": "username and password required"}), 400

    rows = db.execute("SELECT id, hash FROM users WHERE username = ?", username)
    if not rows:
        return jsonify({"error": "invalid username or password"}), 400

    if not check_password_hash(rows[0]["hash"], password):
        return jsonify({"error": "invalid username or password"}), 400

    session["user_id"] = rows[0]["id"]
    return jsonify({"id": rows[0]["id"], "username": username})


@app.post("/api/logout")
def logout():
    session.clear()
    return jsonify({"success": True})


if __name__ == "__main__":
    # Start backend:
    #   flask --app app.py run
    app.run(debug=True)