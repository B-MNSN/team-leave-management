# Backend

This is the **Node.js + Express backend API** for the Team Leave Management System.

The backend handles leave request logic, validation, and database operations.

---

# Installation

Navigate to backend folder

```
cd backend
```

Install dependencies

```
npm install
```

---

# Environment Variables

Create a `.env` file based on `.env.example`.

Example configuration

```
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=leave_management
```

---

# Database Setup

The database schema and initial data are provided in the following files:

```
backend/db/schema.sql
backend/db/data.sql
```

---

## 1 Import Database Schema

The schema file will automatically create the database and tables.

```
mysql -u root -p < backend/db/schema.sql
```

---

## 3 Insert Initial Data

Import seed data

```
mysql -u root -p leave_management < backend/db/data.sql
```

This will insert initial records such as:

* users
* leave types
* sample leave data

---

# Run Server

Start the backend server

```
npm start
```

or

```
node server.js
```

Server runs at

```
http://localhost:5000
```

---

# Tech Stack

* Node.js
* Express.js
* MySQL
