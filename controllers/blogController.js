const blogModel = require('../models/blogModel');

exports.createBlogPost = async (req, res) => {
    try {
        const { title, content, imageUrl, videoUrl, campaignId } = req.body;
        await blogModel.createPost({ title, content, imageUrl, videoUrl, campaignId });
        res.status(201).json({ message: 'Blog post created successfully' });
    } catch (err) {
        console.error(' Blog Creation Error:', err);
        res.status(500).json({ message: 'Failed to create blog post' });
    }
};

exports.getAllBlogPosts = async (req, res) => {
    try {
        const posts = await blogModel.getAllPosts();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve blog posts' });
    }
};

exports.getBlogPostById = async (req, res) => {
    try {
        const post = await blogModel.getPostById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve blog post' });
    }
};

exports.deleteBlogPost = async (req, res) => {
    try {
        await blogModel.deletePost(req.params.id);
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete blog post' });
    }
};
