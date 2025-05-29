
// routes/user.js
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authenticate = require('../middlewares/authMiddleware');

// 로그인한 사용자의 북마크 목록 조회
router.get('/me/bookmarks', authenticate, recipeController.getBookmarks);

module.exports = router;
