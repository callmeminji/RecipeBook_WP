// routes/user.js (새 파일 만들기)
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

router.get('/users/:id/bookmarks', recipeController.getBookmarks);

module.exports = router;