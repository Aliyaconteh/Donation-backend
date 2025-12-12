const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    updateUserRole,
    deleteUser
} = require('../controllers/userController');

const authenticate = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

router.get('/', authenticate, isAdmin, getAllUsers);
router.put('/:id/role', authenticate, isAdmin, updateUserRole);
router.delete('/:id', authenticate, isAdmin, deleteUser);

module.exports = router;
