const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String, // 예: "dessert", "korean", "snack"
    required: true,
  },
  difficulty: {
    type: String, // 예: "easy", "medium", "hard"
    required: true,
  },
  cookingTime: {
    type: Number, // 분 단위
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);
