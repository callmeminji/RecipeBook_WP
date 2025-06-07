const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 회원가입 컨트롤러 함수
const signupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('DEBUG signup data:', req.body);

    if (!username || !email || !password) {
      return res.status(400).json({ message: '모든 항목(username, email, password)을 입력해주세요.' });
    }

    // 이메일 중복 체크
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 사용자 생성
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'Signup successful!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// 로그인 컨트롤러 함수
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("로그인 요청:", email, password);

    if (!email || !password) {
      return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
    }

    // 이메일로 사용자 조회
    const user = await User.findOne({ email });
    console.log("로그인 시도 유저:", user);

    if (!user) {
      console.log("이메일 없음");
      return res.status(401).json({ message: 'User not found.' });
    }

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("비밀번호 틀림");
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 로그인 성공 응답
    return res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        _id: user._id,              // <--- 여기 반드시 _id
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { signupUser, loginUser };
