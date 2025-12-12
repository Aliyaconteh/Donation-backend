const db = require('../config/db');

exports.getImpactStats = async (req, res) => {
    try {
        const [campaigns] = await db.execute(`SELECT COUNT(*) as total FROM campaigns`);
        const [donations] = await db.execute(`SELECT COUNT(*) as total, SUM(amount) as totalAmount FROM donations`);
        const [mostActive] = await db.execute(` SELECT c.title, SUM(d.amount) as amount  FROM donations d  JOIN campaigns c ON c.id = d.campaign_id   GROUP BY d.campaign_id  ORDER BY amount DESC   LIMIT 1  `);

        res.json({
            totalCampaigns: campaigns[0].total || 0,
            totalDonations: donations[0].total || 0,
            totalAmount: donations[0].totalAmount || 0,
            mostActiveCampaign: mostActive[0] || null,
        });
    } catch (err) {
        console.error(' Impact error:', err);
        res.status(500).json({ message: 'Failed to fetch impact data' });
    }
};
