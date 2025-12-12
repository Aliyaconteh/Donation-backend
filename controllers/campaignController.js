const campaignModel = require('../models/campaignModel');
const db = require('../config/db');



exports.getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await campaignModel.getAll();
        res.json(campaigns);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch campaigns', error: err.message });
    }
};


exports.getCampaignById = async (req, res) => {
    const { id } = req.params;
    try {
        const campaign = await campaignModel.getById(id);
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
        res.json(campaign);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch campaign', error: err.message });
    }
};


exports.createCampaign = async (req, res) => {
    const { title, description, image_url, goal_amount, category } = req.body;
    const userId = req.user.id;

    try {
        await campaignModel.create(title, description, image_url, goal_amount, category, userId);
        res.status(201).json({ message: 'Campaign created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create campaign', error: err.message });
    }
};


exports.updateCampaign = async (req, res) => {
    const { id } = req.params;
    const { title, description, image_url, goal_amount, category } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    try {
        const result = await campaignModel.update(id, title, description, image_url, goal_amount, category, userId, isAdmin);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Campaign not found or not authorized' });
        }
        res.json({ message: 'Campaign updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update campaign', error: err.message });
    }
};


exports.deleteCampaign = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    console.log('🔍 DELETE Request Details:', { id, userId, isAdmin });

    try {
        const result = await campaignModel.delete(id, userId, isAdmin);
        console.log(' DB Delete Result:', result);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Campaign not found or not authorized' });
        }

        res.json({ message: 'Campaign deleted successfully' });
    } catch (err) {
        console.error('DB Delete Error:', err);
        res.status(500).json({ message: 'Failed to delete campaign', error: err.message });
    }
};
exports.verifyCampaign = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute('UPDATE campaigns SET is_verified = 1 WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        res.json({ message: 'Campaign verified successfully' });
    } catch (err) {
        console.error(' Verification Error:', err);
        res.status(500).json({ message: 'Failed to verify campaign', error: err.message });
    }
};
