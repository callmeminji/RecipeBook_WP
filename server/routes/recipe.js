const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authenticate = require('../middlewares/authMiddleware');

// 레시피 필터링 (공개)
router.get('/filter', recipeController.filterRecipes);

// 전체 레시피 목록 조회 (공개)
router.get('/', recipeController.getAllRecipes);

// 레시피 제목 검색 (공개)
router.get('/search', recipeController.searchRecipes);

// 단일 레시피 조회 (공개)
router.get('/:id', recipeController.getRecipeById);

// 레시피 생성 (로그인 필요)
router.post('/', authenticate, recipeController.createRecipe);

// 레시피 수정 (로그인 + 작성자 본인만 가능)
router.put('/:id', authenticate, recipeController.updateRecipe);

// 레시피 삭제 (로그인 + 작성자 본인만 가능)
router.delete('/:id', authenticate, recipeController.deleteRecipe);

// 레시피 북마크 추가 (로그인 필요)
router.post('/:id/bookmark', authenticate, recipeController.bookmarkRecipe);

// 레시피 북마크 삭제 (로그인 필요)
router.delete('/:id/bookmark', authenticate, recipeController.unbookmarkRecipe);

// 내가 쓴 레시피 목록 (로그인 필요)
router.get('/my/recipes', authenticate, recipeController.getMyRecipes);

module.exports = router;
