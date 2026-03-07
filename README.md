# Team Leave Management System

A simple **Leave Management System** that allows employees to submit leave requests and managers to approve or reject them.

The system helps teams track leave balances, manage leave requests, and maintain a structured approval workflow.

---

# Project Structure

```
team-leave-management
│
├── frontend   # React (Vite) client application
└── backend    # Node.js + Express API
    ├── db/ 
    │ ├── schema.sql # Database structure 
    │ └── data.sql # Initial seed data
```

* **frontend** – User interface for employees and managers
* **backend** – REST API and business logic
* **database** – MySQL used to store users, leave requests, and leave types

---

# Technology Stack

## Frontend

* React (Vite)
* Axios
* React Icons
* SCSS / Bootstrap

### Why React + Vite

- **Fast development server**
- **Component-based architecture** for building reusable UI components
- **Optimized build performance** with modern tooling
- **Clean separation of UI logic and state management**
- **Easy integration with REST APIs** using libraries like Axios

---

## Backend

* Node.js
* Express.js
* MySQL

### Why Node.js + Express

- **Lightweight and flexible backend framework** for building RESTful APIs
- **Single language across the stack** (JavaScript for both frontend and backend)
- **Large ecosystem of packages** through npm
- **Efficient handling of asynchronous operations**
- **Fast development for scalable API services**

---

# Features

### Employee

* View leave balance
* Submit leave requests
* View leave request history
* Cancel pending leave requests

### Manager

* View team leave requests
* Approve or reject leave requests
* Add comments when approving or rejecting

---

# Local Development Setup

## 1 Clone repository

```
git clone https://github.com/your-username/team-leave-management.git
cd team-leave-management
```

---

# 2 Setup Backend

Navigate to backend folder

```
cd backend
npm install
```

Create `.env` from `.env.example`.

Example `.env`

```
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=leave_management
```

---

# 3 Setup Database

This project provides SQL files to create the database schema and insert initial data.

Location:

```
backend/db/schema.sql
backend/db/data.sql
```

### Step 1 Import Database Schema

The schema file will automatically create the database and tables.

```
mysql -u root -p < backend/db/schema.sql
```

### Step 3 Insert Initial Data

Import the seed data:

```
mysql -u root -p leave_management < backend/db/data.sql
```

This will insert:

* sample users
* leave types
* example leave requests

---

# 4 Run Backend Server

```
npm run dev
```

Backend runs at

```
http://localhost:3000
```

---

# 5 Setup Frontend

Navigate to frontend folder

```
cd frontend
npm install
npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---
# Demo Login Accounts

Sample users for testing.

| Role     | Email                 | Password |
| -------- | ----------------------| -------- |
| Employee | user1@company.com     | user1234 |
| Manager  | manager@company.com   | user1234 |

---
# Author

Developed as a **Team Leave Management System project** using React, Node.js, Express, and MySQL.
