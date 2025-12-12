const db = require('../config/db');

exports.create = async (user_id, campaign_id, amount, is_recurring) => {
    await db.execute(
        'INSERT INTO donations (user_id, campaign_id, amount, is_recurring) VALUES (?, ?, ?, ?)',
        [user_id, campaign_id, amount, is_recurring]
    );
};

exports.getByUserId = async (user_id) => {
    const [rows] = await db.execute(
        'SELECT d.*, c.title AS campaign_title FROM donations d JOIN campaigns c ON d.campaign_id = c.id WHERE d.user_id = ? ORDER BY d.created_at DESC',
        [user_id]
    );
    return rows;
};

exports.getByCampaignId = async (campaign_id) => {
    const [rows] = await db.execute(
        'SELECT d.*, u.name AS donor_name FROM donations d JOIN users u ON d.user_id = u.id WHERE d.campaign_id = ? ORDER BY d.created_at DESC',
        [campaign_id]
    );
    return rows;
};
