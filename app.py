import os
from cs50 import SQL  # type: ignore
from flask import Flask, session, request, jsonify
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash

# Create Flask app
app = Flask(__name__)
app.secret_key = "dev"  # Used to sign session cookies (dev only)

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_FILE_DIR"] = os.path.join(os.getcwd(), "flask_session")
Session(app)

# Create DB if not exists
if not os.path.exists("wealthwise.db"):
    open("wealthwise.db", "a").close()

# Connect to SQLite database
db = SQL("sqlite:///wealthwise.db")

# Create users table
db.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)
""")

# Create expenses table
db.execute("""
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    spent_at TEXT NOT NULL, -- YYYY-MM-DD
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
""")

# Create login history table
db.execute("""
CREATE TABLE IF NOT EXISTS login_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    logged_in_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
""")

# Disable caching
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

# Register a new user
@app.post("/api/register")
def register():
    # Get form data
    username = request.form.get("username")
    password = request.form.get("password")
    confirmation = request.form.get("confirmation")

    # Validation
    if not username:
        return jsonify({"error": "username required"}), 400
    if not password:
        return jsonify({"error": "password required"}), 400
    if not confirmation:
        return jsonify({"error": "confirmation required"}), 400
    if password != confirmation:
        return jsonify({"error": "passwords do not match"}), 400
    if len(password) < 8:
        return jsonify({"error": "password must be at least 8 characters"}), 400

    # Hash password
    hashed = generate_password_hash(password)

    # Insert user
    try:
        db.execute(
            "INSERT INTO users (username, hash) VALUES (?, ?)",
            username, hashed
        )
    except Exception as e:
        # Debug print (helps to see real error)
        print("REGISTER ERROR:", e)
        return jsonify({"error": "username already exists"}), 400

    # Log user in
    user_id = db.execute(
        "SELECT id FROM users WHERE username = ?",
        username
    )[0]["id"]

    session["user_id"] = user_id

    return jsonify({
        "id": user_id,
        "username": username,
    }), 201

# Log in existing user
@app.post("/api/login")
def login():
    # Get form data
    username = request.form.get("username")
    password = request.form.get("password")

    # Validation
    if not username or not password:
        return jsonify({"error": "username and password required"}), 400

    # Find user
    rows = db.execute(
        "SELECT id, hash FROM users WHERE username = ?",
        username
    )

    # Check password
    if not rows or not check_password_hash(rows[0]["hash"], password):
        return jsonify({"error": "invalid username or password"}), 400

    user_id = rows[0]["id"]

    # Save user in session
    session["user_id"] = user_id

    # Save login history
    db.execute(
        "INSERT INTO login_history (user_id) VALUES (?)",
        user_id
    )

    return jsonify({
        "id": user_id,
        "username": username
    })

# Log out user
@app.post("/api/logout")
def logout():
    session.clear()
    return jsonify({"success": True})


# Return currently logged-in user
@app.get("/api/me")
def me():
    # Check session
    user_id = session.get("user_id")

    # If user is not logged in, return null
    if not user_id:
        return jsonify({"user": None})

    # Get user info
    rows = db.execute(
        "SELECT id, username FROM users WHERE id = ?",
        user_id
    )
    
    # Validate
    if not rows:
        session.clear()
        return jsonify({"user": None})

    return jsonify({
        "user": {
            "id": rows[0]["id"],
            "username": rows[0]["username"],
        }
    })


# Get login history
@app.get("/api/profile/logins")
def get_login_history():
    # Check if user is logged in
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "unauthorized"}), 401

    # Get all login records for this user
    rows = db.execute(
        """
        SELECT id, logged_in_at
        FROM login_history
        WHERE user_id = ?
        ORDER BY logged_in_at DESC, id DESC
        """,
        user_id
    )

    return jsonify(rows)
    

# Get all expenses for current user
@app.get("/api/expenses")
def get_expenses():
    # Check if user is logged in
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "unauthorized"}), 401

    # Select all expenses for this user
    rows = db.execute(
        """
        SELECT id, amount, category, description, spent_at
        FROM expenses
        WHERE user_id = ?
        ORDER BY spent_at DESC, id DESC
        """,
        user_id
    )

    return jsonify(rows)


# Create a new expense
@app.post("/api/expenses")
def create_expense():
    # User must be logged in
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "unauthorized"}), 401

    # Get data from request
    data = request.get_json()
    if not data:
        return jsonify({"error": "invalid json"}), 400

    amount = data.get("amount")
    category = data.get("category")
    description = data.get("description")
    spent_at = data.get("spent_at")

    # Required fields check
    if amount is None or not category or not spent_at:
        return jsonify({"error": "amount, category, spent_at required"}), 400

    # Amount must be a positive number
    try:
        amount = float(amount)
        if amount <= 0:
            return jsonify({"error": "amount must be positive"}), 400
    except:
        return jsonify({"error": "amount must be a number"}), 400

    # Insert expense into database
    db.execute(
        """
        INSERT INTO expenses (user_id, amount, category, description, spent_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        user_id, amount, category, description, spent_at
    )

    return jsonify({"success": True}), 201


# Update an existing expense
@app.put("/api/expenses/<int:expense_id>")
def update_expense(expense_id):
    # Check if user is logged in
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "unauthorized"}), 401

    # Get data from request
    data = request.get_json()
    if not data:
        return jsonify({"error": "invalid json"}), 400

    amount = data.get("amount")
    category = data.get("category")
    description = data.get("description")
    spent_at = data.get("spent_at")

    # Required fields check
    if amount is None or not category or not spent_at:
        return jsonify({"error": "amount, category, spent_at required"}), 400

    # Amount must be a positive number
    try:
        amount = float(amount)
        if amount <= 0:
            return jsonify({"error": "amount must be positive"}), 400
    except:
        return jsonify({"error": "amount must be a number"}), 400

    # Update expense (only if it belongs to the user)
    updated = db.execute(
        """
        UPDATE expenses
        SET amount = ?, category = ?, description = ?, spent_at = ?
        WHERE id = ? AND user_id = ?
        """,
        amount, category, description, spent_at, expense_id, user_id
    )

    if updated == 0:
        return jsonify({"error": "not found"}), 404

    return jsonify({"success": True})


# Delete an expense
@app.delete("/api/expenses/<int:expense_id>")
def delete_expense(expense_id):
    # Check if user is logged in
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "unauthorized"}), 401

    # Check if expense exists and belongs to user
    rows = db.execute(
        "SELECT id FROM expenses WHERE id = ? AND user_id = ?",
        expense_id, user_id
    )

    if not rows:
        return jsonify({"error": "expense not found"}), 404

    # Delete expense
    db.execute(
        "DELETE FROM expenses WHERE id = ? AND user_id = ?",
        expense_id, user_id
    )

    return jsonify({"success": True})


# Update username
@app.put("/api/profile/username")
def update_username():
    # Check if user is logged in
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "unauthorized"}), 401

    # Get data from request
    data = request.get_json()
    if not data:
        return jsonify({"error": "invalid json"}), 400

    new_username = data.get("username")

    # Username is required
    if not new_username:
        return jsonify({"error": "username required"}), 400

    # Update username in database
    try:
        db.execute(
            "UPDATE users SET username = ? WHERE id = ?",
            new_username, user_id
        )
    except:
        return jsonify({"error": "username already exists"}), 400

    return jsonify({"success": True})


# Change password
@app.put("/api/profile/password")
def update_password():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "unauthorized"}), 401

    # Get data
    data = request.get_json()
    if not data:
        return jsonify({"error": "invalid json"}), 400

    current_password = data.get("current_password")
    new_password = data.get("new_password")
    confirmation = data.get("confirmation")

    # Validation
    if not current_password:
        return jsonify({"error": "current password required"}), 400
    if not new_password:
        return jsonify({"error": "new password required"}), 400
    if not confirmation:
        return jsonify({"error": "confirmation required"}), 400
    if new_password != confirmation:
        return jsonify({"error": "passwords do not match"}), 400
    if len(new_password) < 8:
        return jsonify({"error": "password must be at least 8 characters"}), 400

    # Get current hash
    rows = db.execute("SELECT hash FROM users WHERE id = ?", user_id)
    if not rows:
        session.clear()
        return jsonify({"error": "unauthorized"}), 401

    # Check current password
    if not check_password_hash(rows[0]["hash"], current_password):
        return jsonify({"error": "current password is wrong"}), 400

    hashed = generate_password_hash(new_password)

    db.execute("UPDATE users SET hash = ? WHERE id = ?", hashed, user_id)

    return jsonify({"success": True})



# Run development server
if __name__ == "__main__":
    app.run(debug=True)