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
    type: [String],
    required: true,
    validate: v => Array.isArray(v) && v.length > 0
  },
  image: {
    type: String,
    default: null, // 없을 경우 기본 null
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true }); // 자동으로 createdAt, updatedAt 생성됨

module.exports = mongoose.model('Recipe', recipeSchema);
