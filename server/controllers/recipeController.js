const User = require('../models/User');
const Recipe = require('../models/Recipe');

const BASE_URL = process.env.BASE_URL || 'https://recipeya.onrender.com';

// 헬퍼 함수
const normalizeIngredients = (ingredients) => {
  if (!ingredients) return [];
  if (!Array.isArray(ingredients)) return [ingredients];
  return ingredients;
};

// 전체 레시피 목록
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    const formattedRecipes = recipes.map(recipe => ({
      ...recipe.toObject(),
      cookingTime: recipe.cookingTime,
      imageUrl: recipe.image ? `${BASE_URL}/uploads/${recipe.image}` : null
    }));
    res.json(formattedRecipes);
  } catch (err) {
    console.error('[GET ALL ERROR]', err.message);
    res.status(500).json({ message: 'Failed to get recipes' });
  }
};

// 단일 레시피 조회
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const count = await User.countDocuments({ bookmarks: recipe._id });
    let isBookmarked = false;

    if (req.user) {
      const user = await User.findById(req.user.userId);
      if (user && user.bookmarks.map(String).includes(String(recipe._id))) {
        isBookmarked = true;
      }
    }

    res.json({
      ...recipe.toObject(),
      instructions: recipe.content,
      bookmarkCount: count,
      isBookmarked,
      imageUrl: recipe.image ? `${BASE_URL}/uploads/${recipe.image}` : null,
    });
  } catch (err) {
    console.error('[GET BY ID ERROR]', err);
    res.status(500).json({ message: 'Failed to get recipe' });
  }
};

// 레시피 생성
exports.createRecipe = async (req, res) => {
  try {
    const { title, instructions, type, difficulty, cookingTime } = req.body;
    const ingredients = normalizeIngredients(req.body.ingredients);

    if (!title || !instructions || !type || !difficulty || !cookingTime || ingredients.length === 0) {
      return res.status(400).json({ message: 'Missing or invalid required fields' });
    }

    const cookingTimeNumber = Number(cookingTime);
    if (isNaN(cookingTimeNumber)) {
      return res.status(400).json({ message: 'Invalid cookingTime format' });
    }

    let cookingTimeCategory = '';
    if (cookingTimeNumber <= 10) cookingTimeCategory = 'under10';
    else if (cookingTimeNumber <= 30) cookingTimeCategory = 'under30';
    else if (cookingTimeNumber <= 60) cookingTimeCategory = 'under60';
    else cookingTimeCategory = 'over60';

    const imagePath = req.file ? req.file.filename : null;

    const recipe = new Recipe({
      title,
      content: instructions,
      type,
      difficulty,
      cookingTime: cookingTimeNumber,
      cookingTimeCategory,
      ingredients,
      image: imagePath,
      author: req.user.userId,
    });

    await recipe.save();
    res.status(201).json({
      message: 'Recipe created successfully',
      recipeId: recipe._id,
      imageUrl: recipe.image ? `${BASE_URL}/uploads/${recipe.image}` : null
    });
  } catch (err) {
    console.error('[CREATE ERROR]', err);
    res.status(500).json({ message: 'Failed to create recipe', error: err.message });
  }
};

// 레시피 수정
exports.updateRecipe = async (req, res) => {
  try {
    const { title, content, type, difficulty, cookingTime } = req.body;
    const ingredients = normalizeIngredients(req.body.ingredients);

    const cookingTimeNumber = Number(cookingTime);
    if (isNaN(cookingTimeNumber)) {
      return res.status(400).json({ message: 'Invalid cooking time' });
    }

    let cookingTimeCategory = '';
    if (cookingTimeNumber <= 10) cookingTimeCategory = 'under10';
    else if (cookingTimeNumber <= 30) cookingTimeCategory = 'under30';
    else if (cookingTimeNumber <= 60) cookingTimeCategory = 'under60';
    else cookingTimeCategory = 'over60';

    const updateFields = {
      title,
      content,  // 👈 변경된 부분
      type,
      difficulty,
      cookingTime: cookingTimeNumber,
      cookingTimeCategory,
      ingredients,
    };

    if (req.file) {
      updateFields.image = req.file.filename;
    }

    const updated = await Recipe.findOneAndUpdate(
      { _id: req.params.id, author: req.user.userId },
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Recipe not found or not authorized' });
    }

    res.json({
      message: 'Recipe updated successfully',
      recipe: {
        ...updated.toObject(),
        imageUrl: updated.image ? `${BASE_URL}/uploads/${updated.image}` : null
      }
    });
  } catch (err) {
    console.error('[UPDATE ERROR]', err);
    res.status(500).json({ message: 'Failed to update recipe', error: err.message });
  }
};



// 레시피 삭제
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({
      _id: req.params.id,
      author: req.user.userId,
    });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found or not authorized' });
    }

    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    console.error('[DELETE ERROR]', err);
    res.status(500).json({ message: 'Failed to delete recipe', error: err.message });
  }
};

// 북마크 추가
exports.bookmarkRecipe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = req.params.id;
    await User.findByIdAndUpdate(userId, { $addToSet: { bookmarks: recipeId } });
    const bookmarkCount = await User.countDocuments({ bookmarks: recipeId });
    res.status(200).json({
      message: 'Recipe bookmarked',
      bookmarkCount,
      isBookmarked: true
    });
  } catch (err) {
    console.error('[BOOKMARK ERROR]', err);
    res.status(500).json({ message: 'Failed to bookmark recipe' });
  }
};

// 북마크 해제
exports.unbookmarkRecipe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = req.params.id;
    await User.findByIdAndUpdate(userId, { $pull: { bookmarks: recipeId } });
    const bookmarkCount = await User.countDocuments({ bookmarks: recipeId });
    res.status(200).json({
      message: 'Bookmark removed',
      bookmarkCount,
      isBookmarked: false
    });
  } catch (err) {
    console.error('[UNBOOKMARK ERROR]', err);
    res.status(500).json({ message: 'Failed to remove bookmark' });
  }
};

// 필터링
exports.filterRecipes = async (req, res) => {
  try {
    const { type, difficulty, cookingTimeCategory } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;

    if (cookingTimeCategory) {
      if (cookingTimeCategory === "under10") filter.cookingTime = { $lte: 10 };
      else if (cookingTimeCategory === "under30") filter.cookingTime = { $lte: 30 };
      else if (cookingTimeCategory === "under60") filter.cookingTime = { $lte: 60 };
      else if (cookingTimeCategory === "over60") filter.cookingTime = { $gt: 60 };
    }

    const recipes = await Recipe.find(filter);
    const withImages = recipes.map(r => ({
      ...r.toObject(),
      imageUrl: r.image ? `${BASE_URL}/uploads/${r.image}` : null
    }));

    res.json(withImages);
  } catch (err) {
    console.error('[FILTER ERROR]', err);
    res.status(500).json({ message: 'Failed to filter recipes' });
  }
};

// 내 북마크 조회
exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('bookmarks');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const bookmarks = user.bookmarks.map(r => ({
      ...r.toObject(),
      imageUrl: r.image ? `${BASE_URL}/uploads/${r.image}` : null
    }));

    res.json({ bookmarks });
  } catch (err) {
    console.error('[GET BOOKMARKS ERROR]', err);
    res.status(500).json({ message: 'Failed to load bookmarks' });
  }
};

// 검색
exports.searchRecipes = async (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    const recipes = await Recipe.find({ title: new RegExp(keyword, 'i') });
    const withImages = recipes.map(r => ({
      ...r.toObject(),
      imageUrl: r.image ? `${BASE_URL}/uploads/${r.image}` : null
    }));
    res.json(withImages);
  } catch (err) {
    console.error('[SEARCH ERROR]', err);
    res.status(500).json({ message: 'Failed to search recipes', error: err.message });
  }
};

// 내 레시피
exports.getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user.userId }).sort({ createdAt: -1 });
    const withImages = recipes.map(r => ({
      ...r.toObject(),
      imageUrl: r.image ? `${BASE_URL}/uploads/${r.image}` : null
    }));
    res.json(withImages);
  } catch (err) {
    console.error('[MY RECIPES ERROR]', err);
    res.status(500).json({ message: 'Failed to load my recipes' });
  }
};
