// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '이미 등록된 이메일입니다.' });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 유저 저장
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: '회원가입 완료!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 에러' });
  }
};

module.exports = { signup };
