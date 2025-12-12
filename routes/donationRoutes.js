const express = require('express');
const router = express.Router();

const {
    submitDonation,
    getUserDonations,
    getCampaignDonations,
    getAllDonations,
    getReceiptByDonationId
} = require('../controllers/donationController');

const authenticate = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');


router.post('/', authenticate, submitDonation);
router.get('/user', authenticate, getUserDonations);
router.get('/campaign/:id', getCampaignDonations);
router.get('/receipt/:donationId', authenticate, getReceiptByDonationId);
router.get('/all', authenticate, isAdmin, getAllDonations);

module.exports = router;
