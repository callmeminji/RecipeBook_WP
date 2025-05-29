const User = require('../models/User');
const Recipe = require('../models/Recipe');

// 전체 레시피 조회
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get recipes' });
  }
};

// 레시피 하나 조회 (by ID)
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get recipe' });
  }
};

// 레시피 생성
exports.createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).json({ message: 'Recipe created', recipe });
  } catch (err) {
    res.status(400).json({ message: 'Failed to create recipe' });
  }
};

// 레시피 수정
exports.updateRecipe = async (req, res) => {
  try {
    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: 'Recipe not found' });
    res.json({ message: 'Recipe updated', recipe: updated });
  } catch (err) {
    res.status(400).json({ message: 'Failed to update recipe' });
  }
};

// 레시피 삭제
exports.deleteRecipe = async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Recipe not found' });
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete recipe' });
  }
};

exports.bookmarkRecipe = async (req, res) => {
  const userId = req.user.userId; // JWT에서 추출
  const recipeId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 중복 방지
    if (user.bookmarks.includes(recipeId)) {
      return res.status(400).json({ message: 'Already bookmarked' });
    }

    user.bookmarks.push(recipeId);
    await user.save();

    res.json({ message: 'Recipe bookmarked' });
  } catch (err) {
    res.status(500).json({ message: 'Bookmark failed', error: err.message });
  }
};

// 북마크 목록 조회
exports.getBookmarks = async (req, res) => {
  const userId = req.user.userId; // JWT에서 추출된 사용자 ID
  try {
    const user = await User.findById(userId).populate('bookmarks');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load bookmarks' });
  }
};
