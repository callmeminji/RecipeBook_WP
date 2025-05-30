const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authenticate = require('../middlewares/authMiddleware');

// 댓글 작성
router.post('/:recipeId', authenticate, commentController.createComment);

module.exports = router;
