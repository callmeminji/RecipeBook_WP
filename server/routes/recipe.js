const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

router.get('/users/:id/bookmarks', recipeController.getBookmarks);

// 전체 레시피 목록 조회
router.get('/', recipeController.getAllRecipes);

// 단일 레시피 조회
router.get('/:id', recipeController.getRecipeById);

// 레시피 생성
router.post('/', recipeController.createRecipe);

// 레시피 수정
router.put('/:id', recipeController.updateRecipe);

// 레시피 삭제
router.delete('/:id', recipeController.deleteRecipe);

//북마크
router.post('/:id/bookmark', recipeController.bookmarkRecipe);

module.exports = router;

