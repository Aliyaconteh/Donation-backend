const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});


pool.getConnection((err, connection) => {
    if (err) {
        console.error(' Database connection failed:', err.message);
    } else {
        console.log('MySQL Database connected successfully');
        connection.release();
    }
});


module.exports = pool.promise();
