// routes/protected.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');


// GET /api/protected
router.get('/', authenticate, (req, res) => {
  res.json({ message: 'You are authenticated!', user: req.user });
});

module.exports = router;
