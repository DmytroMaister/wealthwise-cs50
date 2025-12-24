# WealthWise

## Video Demo https://youtu.be/7LrA35Oy-nk

---

## Description

**WealthWise** is a full-stack personal finance web application built as a final project for CS50.

The application allows users to register, log in, and manage their personal expenses in a secure, session-based environment. Each user can create, update, and delete expenses, view basic statistics, manage their profile, and review login history.

The project demonstrates backend development with Flask and SQLite, frontend development with React and TypeScript, session-based authentication, and full CRUD functionality.

---

## Features

- User registration and login with password hashing
- Session-based authentication (Flask-Session)
- Create, read, update, and delete expenses (CRUD)
- Expense statistics dashboard
- Profile management (change username and password)
- Login history tracking
- Protected routes (only logged-in users can access data)
- Frontend built with React + TypeScript
- Backend API built with Flask

---

## Technologies Used

### Backend

- Python
- Flask
- Flask-Session
- SQLite
- CS50 SQL library
- Werkzeug (password hashing)

### Frontend

- React
- TypeScript
- Material UI
- Axios
- Vite

---

## Project Structure

wealthwise-cs50/
│
├── app.py # Flask backend
├── requirements.txt # Python dependencies
├── README.md # Project documentation
├── wealthwise.db # SQLite database (created at runtime)
├── flask_session/ # Session storage
│
└── frontend/
├── package.json
├── src/
│ ├── api/ # API client files
│ ├── components/ # Reusable UI components
│ ├── pages/ # Application pages
│ ├── types/ # Shared TypeScript types
│ ├── utils/ # Helpers and constants
│ ├── App.tsx
│ └── main.tsx
└── index.html

---

## How to Run the Project

### Backend

Create and activate a virtual environment, install dependencies, and run the server:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask run
```
