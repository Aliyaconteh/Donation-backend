const express = require('express');
const router = express.Router();
const { getImpactStats } = require('../controllers/impactController');
const authenticate = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

router.get('/', authenticate, isAdmin, getImpactStats);

module.exports = router;
