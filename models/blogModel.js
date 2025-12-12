const db = require('../config/db');

exports.createPost = async ({ title, content, imageUrl, videoUrl, campaignId }) => {
    const [result] = await db.execute(
        `INSERT INTO blog_posts (title, content, image_url, video_url, campaign_id) VALUES (?, ?, ?, ?, ?)`,
        [title, content, imageUrl || null, videoUrl || null, campaignId || null]
    );
    return result;
};

exports.getAllPosts = async () => {
    const [rows] = await db.execute(`SELECT * FROM blog_posts ORDER BY created_at DESC`);
    return rows;
};

exports.getPostById = async (id) => {
    const [rows] = await db.execute(`SELECT * FROM blog_posts WHERE id = ?`, [id]);
    return rows[0];
};

exports.deletePost = async (id) => {
    const [result] = await db.execute(`DELETE FROM blog_posts WHERE id = ?`, [id]);
    return result;
};
