// authMiddleware.js

const jwt = require('jsonwebtoken');

// 인증 미들웨어
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 헤더에 토큰이 없으면 에러 반환
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // JWT_SECRET이 정의되어 있는지 확인
    if (!process.env.JWT_SECRET) {
      console.error('[ERROR] JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ message: 'Server configuration error: JWT secret is missing.' });
    }

    // 토큰 검증 후 사용자 정보 저장
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 이후 라우터에서 req.user로 사용자 정보 접근 가능
    next(); // 다음 미들웨어로 이동
  } catch (err) {
    console.error('[JWT VERIFY ERROR]', err.message);
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticate;
