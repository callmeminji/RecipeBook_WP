const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },               // 레시피 제목
  content: { type: String, required: true },             // 설명 또는 조리법
  type: { type: String, required: true },                // 분류 (한식, 중식 등)
  difficulty: { type: String, required: true },          // 난이도
  cookingTime: { type: Number, required: true },         // 조리 시간 (분 단위)
  cookingTimeCategory: {
    type: String,
    enum: ['under10', 'under30', 'under60', 'over60'],
    required: true,
  },
  ingredients: [
    {
      name: { type: String, required: true },            // 재료 이름
      quantity: { type: String, required: true },        // 양 (예: 100g, 1컵 등)
    }
  ],
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
