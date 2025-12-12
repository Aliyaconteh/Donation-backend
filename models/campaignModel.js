const db = require('../config/db');

exports.getAll = async () => {
    const [rows] = await db.execute('SELECT * FROM campaigns ORDER BY created_at DESC');
    return rows;
};

exports.getById = async (id) => {
    const [rows] = await db.execute('SELECT * FROM campaigns WHERE id = ?', [id]);
    return rows[0];
};

exports.create = async (title, description, image_url, goal_amount, category, created_by) => {
    await db.execute(
        'INSERT INTO campaigns (title, description, image_url, goal_amount, category, created_by) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, image_url, goal_amount, category, created_by]
    );
};

exports.addDonationAmount = async (amount, campaignId) => {
    await db.execute(
        'UPDATE campaigns SET current_amount = current_amount + ? WHERE id = ?',
        [amount, campaignId]
    );
};

exports.update = async (id, title, description, image_url, goal_amount, category, userId, isAdmin) => {
    let query, params;
    if (isAdmin) {
        // Admin can update any campaign
        query = `UPDATE campaigns SET title = ?, description = ?, image_url = ?, goal_amount = ?, category = ? WHERE id = ?`;
        params = [title, description, image_url, goal_amount, category, id];
    } else {
        // Normal user can update only campaigns they created
        query = `UPDATE campaigns SET title = ?, description = ?, image_url = ?, goal_amount = ?, category = ? WHERE id = ? AND created_by = ?`;
        params = [title, description, image_url, goal_amount, category, id, userId];
    }
    const [result] = await db.execute(query, params);
    return result;
};

exports.delete = async (id, userId, isAdmin) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Delete related donations first
        await connection.execute('DELETE FROM donations WHERE campaign_id = ?', [id]);

        // Delete the campaign
        let result;
        if (isAdmin) {
            [result] = await connection.execute(
                'DELETE FROM campaigns WHERE id = ?',
                [id]
            );
        } else {
            [result] = await connection.execute(
                'DELETE FROM campaigns WHERE id = ? AND created_by = ?',
                [id, userId]
            );
        }

        await connection.commit();
        return result;

    } catch (error) {
        await connection.rollback();
        console.error('❌ Delete Transaction Error:', error);
        throw error;

    } finally {
        connection.release();
    }
};
exports.verify = async (id) => {
    const [result] = await db.execute('UPDATE campaigns SET verified = TRUE WHERE id = ?', [id]);
    return result;
};
