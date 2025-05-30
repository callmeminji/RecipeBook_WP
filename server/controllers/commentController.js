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

// 댓글 조회 (특정 레시피에 달린 모든 댓글)
exports.getCommentsByRecipe = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const comments = await Comment.find({ recipe: recipeId }).populate('author', 'username');
    res.json({ comments });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments', error: err.message });
  }
};

// 댓글 수정
exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.user.userId)
      return res.status(403).json({ message: 'Not authorized to update this comment' });

    comment.content = content;
    await comment.save();

    res.json({ message: 'Comment updated', comment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update comment', error: err.message });
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.user.userId)
      return res.status(403).json({ message: 'Not authorized to delete this comment' });

    await Comment.findByIdAndDelete(commentId);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment', error: err.message });
  }
};
