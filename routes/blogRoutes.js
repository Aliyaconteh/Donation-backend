const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authenticate = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

router.get('/', blogController.getAllBlogPosts);
router.get('/:id', blogController.getBlogPostById);
router.post('/', authenticate, isAdmin, blogController.createBlogPost);
router.delete('/:id', authenticate, isAdmin, blogController.deleteBlogPost);

module.exports = router;
