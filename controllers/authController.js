const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};
