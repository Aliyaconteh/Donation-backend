const db = require('../config/db');

// Get user by email
exports.findByEmail = async (email) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

// Create user
exports.create = async (name, email, hashedPassword) => {
    await db.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
    );
};
