# WealthWise

#### Video Demo https://youtu.be/7LrA35Oy-nk

---

## Description

**WealthWise** is a full-stack personal finance web application built as a final project for CS50.
The goal of the project is to provide a simple but complete system that allows users to track their personal expenses while demonstrating core web development concepts such as authentication, session management, database design, and full CRUD operations.

The application allows users to register an account, log in securely, and manage their own data in an isolated environment. Each user has access only to their own expenses and profile information. Authentication is implemented using server-side sessions with Flask-Session, ensuring that sensitive operations are protected and available only to authenticated users.

Once logged in, users can create, view, update, and delete expense records. Each expense contains an amount, category, optional description, and date. This functionality demonstrates full CRUD (Create, Read, Update, Delete) operations, which are handled through a REST-style API implemented in Flask and consumed by the frontend using Axios. Expenses are stored in a SQLite database, making the application easy to run without additional database setup.

In addition to basic expense management, the application includes a dashboard that displays simple statistics, such as total expenses, recent expenses, and aggregated values. This helps users quickly understand their spending behavior while also demonstrating data aggregation and presentation on the frontend.

The project also includes a profile section where users can manage their account settings. Users can update their username and change their password, with proper validation and password hashing handled on the backend using Werkzeug. To enhance security and transparency, the application tracks login history and displays recent login timestamps in the profile page. This feature demonstrates additional database modeling beyond the core expense functionality and provides meaningful feedback to the user.

From a technical perspective, the backend is implemented using Flask and follows a clear separation of concerns. Routes are organized around resources such as authentication, expenses, and profile management. Input validation is performed on the server side, and meaningful error messages are returned to the frontend when invalid data is submitted. Sessions are stored using Flask-Session with filesystem-based storage.

The frontend is built with React and TypeScript and focuses on clarity, maintainability, and usability. Components are organized by responsibility, reusable UI elements are extracted into shared components, and application state is managed locally using React hooks. Material UI is used to provide a clean and consistent user interface, Axios handles communication with the backend API.

The frontend and backend are intentionally separated into different folders to reflect a real-world project structure and to clearly distinguish responsibilities between the client and server. This separation also makes the project easier to understand, maintain, and extend in the future.

Overall, WealthWise demonstrates a complete full-stack web application that combines authentication, database design, CRUD functionality, frontend-backend communication, and user-focused features. The project reflects the concepts taught throughout CS50 while also incorporating practical design decisions aimed at building a realistic and maintainable application.

---

## Design Decisions

This project was designed as a session-based web application rather than using token-based authentication.
Flask-Session was chosen to keep authentication simple and aligned with the CS50.

The frontend and backend are separated into two folders to clearly distinguish responsibilities.
The backend exposes a REST API, while the frontend consumes it using Axios.

SQLite was selected as the database due to its simplicity and because it requires no additional setup,
making the project easy to run.

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

## Prerequisites

To run this project locally, you will need:

- Python 3.10 or newer
- Node.js (v18 or newer)
- npm (comes with Node.js)

## How to Run the Project

### Backend

Create and activate a virtual environment, install dependencies, and run the server:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask run
```

### Frontend

Navigate to frontend directory, install dependencies, and run the server:

```bash
cd frontend
npm install
npm run dev
```
