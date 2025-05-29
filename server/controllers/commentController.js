const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');

// 댓글 작성
exports.createComment = async (req, res) => {
  const { recipeId } = req.params;
  const { content } = req.body;

  try {
    // 해당 레시피 존재 여부 확인
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const comment = new Comment({
      recipe: recipeId,
      author: req.user.userId,
      content,
    });

    await comment.save();
    res.status(201).json({ message: 'Comment created', comment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create comment', error: err.message });
  }
};
