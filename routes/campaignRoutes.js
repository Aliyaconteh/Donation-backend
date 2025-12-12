const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

router.get('/', campaignController.getAllCampaigns);
router.get('/:id', campaignController.getCampaignById);
router.post('/', authMiddleware, campaignController.createCampaign);
router.put('/:id', authMiddleware, isAdmin, campaignController.updateCampaign);
router.delete('/:id', authMiddleware, isAdmin, campaignController.deleteCampaign);
router.put('/:id/verify', authMiddleware, isAdmin, campaignController.verifyCampaign); // ✅ verify

module.exports = router;
