const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, required: true },
  difficulty: { type: String, required: true },
  cookingTime: { type: Number, required: true },
  cookingTimeCategory: {
    type: String,
    enum: ['under10', 'under30', 'under60', 'over60'],
    required: true,
  },
  ingredients: {
    type: [String], // ← 여기를 문자열 배열로 변경
    required: true,
    validate: v => Array.isArray(v) && v.length > 0
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Recipe', recipeSchema);
