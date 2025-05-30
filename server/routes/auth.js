const express = require('express');
const router = express.Router();
const { signupUser, loginUser } = require('../controllers/authController');

// 회원가입
router.post('/signup', signupUser);

// 로그인
router.post('/login', loginUser);

module.exports = router;