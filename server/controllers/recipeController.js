const User = require('../models/User');
const Recipe = require('../models/Recipe');
const fs = require('fs');
const mongoose = require('mongoose');

// 전체 레시피 목록 조회 (bookmarkCount 포함)
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    const recipesWithBookmarkCount = await Promise.all(
      recipes.map(async (recipe) => {
        const count = await User.countDocuments({ bookmarks: recipe._id });
        return {
          ...recipe.toObject(),
          bookmarkCount: count,
        };
      })
    );
    res.json(recipesWithBookmarkCount);
  } catch (err) {
    console.error('[GET ALL ERROR]', err);
    res.status(500).json({ message: 'Failed to get recipes' });
  }
};

// 단일 레시피 조회 (bookmarkCount 포함)
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const count = await User.countDocuments({ bookmarks: recipe._id });
    res.json({ ...recipe.toObject(), bookmarkCount: count });
  } catch (err) {
    console.error('[GET BY ID ERROR]', err);
    res.status(500).json({ message: 'Failed to get recipe' });
  }
};

// 레시피 생성
// 레시피 생성
exports.createRecipe = async (req, res) => {
  try {
    const { title, instructions, type, difficulty, cookingTime } = req.body;

    // 재료 보정 처리
    let ingredients = req.body.ingredients;
    if (!ingredients) ingredients = [];
    else if (typeof ingredients === 'string') ingredients = [ingredients]; // 단일 항목일 경우 문자열 → 배열
    else if (!Array.isArray(ingredients)) ingredients = [String(ingredients)];

    // 필수 값 검증
    if (
      !title ||
      !instructions ||
      !type ||
      !difficulty ||
      !cookingTime ||
      ingredients.length === 0
    ) {
      console.error('[VALIDATION ERROR]', {
        title,
        instructions,
        type,
        difficulty,
        cookingTime,
        ingredients
      });
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

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized: user not found in request' });
    }

    // 이미지 업로드 확인
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

    console.log('[CREATE SUCCESS] Recipe ID:', recipe._id);
    res.status(201).json({
      message: 'Recipe created successfully',
      recipeId: recipe._id
    });
  } catch (err) {
    console.error('[CREATE ERROR]', err);
    res.status(500).json({
      message: 'Failed to create recipe',
      error: err.message
    });
  }
};


// 레시피 수정
exports.updateRecipe = async (req, res) => {
  try {
    const { title, content, type, difficulty, cookingTime } = req.body;
    let ingredients = req.body.ingredients;

    if (!ingredients) ingredients = [];
    if (!Array.isArray(ingredients)) ingredients = [ingredients];

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
      content,
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

    res.json({ message: 'Recipe updated successfully', recipe: updated });
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

    await User.findByIdAndUpdate(userId, {
      $addToSet: { bookmarks: recipeId },
    });

    res.status(200).json({ message: 'Recipe bookmarked' });
  } catch (err) {
    console.error('[BOOKMARK ERROR]', err);
    res.status(500).json({ message: 'Failed to bookmark recipe' });
  }
};

// 북마크 삭제
exports.unbookmarkRecipe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = req.params.id;

    await User.findByIdAndUpdate(userId, {
      $pull: { bookmarks: recipeId },
    });

    res.status(200).json({ message: 'Bookmark removed' });
  } catch (err) {
    console.error('[UNBOOKMARK ERROR]', err);
    res.status(500).json({ message: 'Failed to remove bookmark' });
  }
};

// 내가 작성한 레시피 목록 조회
exports.getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user.userId });
    res.json(recipes);
  } catch (err) {
    console.error('[GET MY RECIPES ERROR]', err);
    res.status(500).json({ message: 'Failed to get my recipes' });
  }
};

// 레시피 필터링 (타입, 난이도, 시간카테고리)
exports.filterRecipes = async (req, res) => {
  try {
    const { type, difficulty, cookingTimeCategory } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;
    if (cookingTimeCategory) filter.cookingTimeCategory = cookingTimeCategory;

    const recipes = await Recipe.find(filter);
    res.json(recipes);
  } catch (err) {
    console.error('[FILTER ERROR]', err);
    res.status(500).json({ message: 'Failed to filter recipes' });
  }
};

// 제목으로 레시피 검색
exports.searchRecipes = async (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    const recipes = await Recipe.find({ title: new RegExp(keyword, 'i') });
    res.json(recipes);
  } catch (err) {
    console.error('[SEARCH ERROR]', err);
    res.status(500).json({ message: 'Failed to search recipes', error: err.message });
  }
};

// 북마크 목록 조회
exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('bookmarks');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    console.error('[GET BOOKMARKS ERROR]', err);
    res.status(500).json({ message: 'Failed to load bookmarks' });
  }
};
