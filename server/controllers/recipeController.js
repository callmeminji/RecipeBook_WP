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
    const recipe = new Recipe({
      ...req.body,
      author: req.user.userId // 작성자 정보 저장
    });

    await recipe.save();
    res.status(201).json({ message: 'Recipe created', recipe });
  } catch (err) {
    res.status(400).json({ message: 'Failed to create recipe' });
  }
};

// 레시피 수정
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }

    const { title, content, type, difficulty, cookingTime } = req.body;

    if (title) recipe.title = title;
    if (content) recipe.content = content;
    if (type) recipe.type = type;
    if (difficulty) recipe.difficulty = difficulty;
    if (cookingTime) recipe.cookingTime = cookingTime;

    await recipe.save();
    res.json({ message: 'Recipe updated', recipe });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update recipe' });
  }
};

// 레시피 삭제
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete recipe', error: err.message });
  }
};


// 레시피 북마크 추가
exports.bookmarkRecipe = async (req, res) => {
  const userId = req.user.userId;
  const recipeId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

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
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId).populate('bookmarks');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load bookmarks' });
  }
};

// 내가 쓴 레시피 목록 조회
exports.getMyRecipes = async (req, res) => {
  try {
    const myRecipes = await Recipe.find({ author: req.user.userId });
    res.json(myRecipes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load your recipes' });
  }
};

// 레시피 북마크 삭제
exports.unbookmarkRecipe = async (req, res) => {
  const userId = req.user.userId;
  const recipeId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const index = user.bookmarks.indexOf(recipeId);
    if (index === -1) {
      return res.status(400).json({ message: 'Recipe is not bookmarked' });
    }

    user.bookmarks.splice(index, 1);
    await user.save();

    res.json({ message: 'Bookmark removed' });
  } catch (err) {
    res.status(500).json({ message: 'Unbookmark failed', error: err.message });
  }
};




