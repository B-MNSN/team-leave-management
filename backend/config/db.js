require('dotenv').config();

const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// db.getConnection((err, connection) => {
//     if (err) {
//         console.log('Error connecting to MySQL:', err);
//         return;
//     }
//     console.log('Connected to MySQL');
//     connection.release();
// });


module.exports = db;