const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authenticate = require('../middlewares/authMiddleware');

// 댓글 작성 (레시피 ID 기준)
router.post('/:recipeId', authenticate, commentController.createComment);

// 댓글 조회 (레시피 ID 기준)
router.get('/:recipeId', commentController.getCommentsByRecipe);

// 댓글 수정 (댓글 ID 기준)
router.put('/:commentId', authenticate, commentController.updateComment);

// 댓글 삭제 (댓글 ID 기준)
router.delete('/:commentId', authenticate, commentController.deleteComment);

module.exports = router;
