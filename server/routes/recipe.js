const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authenticate = require('../middlewares/authMiddleware');

// 전체 레시피 목록 조회
router.get('/', recipeController.getAllRecipes);

// 단일 레시피 조회
router.get('/:id', recipeController.getRecipeById);

// 레시피 생성 (로그인 필요)
router.post('/', authenticate, recipeController.createRecipe);

// 레시피 수정 (로그인 + 작성자 본인만 가능)
router.put('/:id', authenticate, recipeController.updateRecipe);

// 레시피 삭제 (로그인 + 작성자 본인만 가능)
router.delete('/:id', authenticate, recipeController.deleteRecipe);

// 레시피 북마크 추가 (로그인 필요)
router.post('/:id/bookmark', authenticate, recipeController.bookmarkRecipe);

module.exports = router;
