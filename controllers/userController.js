const db = require('../config/db');

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.execute(
            'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
};

exports.updateUserRole = async (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;

    try {
        await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
        res.json({ message: `User role updated to ${role}` });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update user role', error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        await db.execute('DELETE FROM users WHERE id = ?', [userId]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete user', error: err.message });
    }
};
