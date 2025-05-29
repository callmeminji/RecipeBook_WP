const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authenticate = require('../middlewares/authMiddleware'); // JWT 인증 미들웨어

// 북마크 목록 조회 (인증 필요)
//router.get('/users/:id/bookmarks', authenticate, recipeController.getBookmarks);

// 전체 레시피 목록 조회 (공개)
router.get('/', recipeController.getAllRecipes);

// 단일 레시피 조회 (공개)
router.get('/:id', recipeController.getRecipeById);

// 레시피 생성 (인증 필요)
router.post('/', authenticate, recipeController.createRecipe);

// 레시피 수정 (인증 필요)
router.put('/:id', authenticate, recipeController.updateRecipe);

// 레시피 삭제 (인증 필요)
router.delete('/:id', authenticate, recipeController.deleteRecipe);

// 레시피 북마크 추가 (인증 필요)
router.post('/:id/bookmark', authenticate, recipeController.bookmarkRecipe);

module.exports = router;
