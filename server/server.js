// server.js

// 1. 환경변수 로딩 (가장 먼저 실행)
const dotenv = require('dotenv');
dotenv.config(); // .env 파일 자동 로딩

// 2. 핵심 모듈 import
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// 3. 환경 변수 확인 (Render 로그에 표시되도록)
console.log("✅ Loaded MONGO_URI:", process.env.MONGO_URI ? "OK" : "❌ MISSING");
console.log("✅ Loaded BASE_URL:", process.env.BASE_URL || "❌ MISSING");
console.log("✅ Loaded JWT_SECRET:", process.env.JWT_SECRET ? "OK" : "❌ MISSING");

// 4. 라우터 import
const commentRoutes = require('./routes/comment');
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipe');
const protectedRoutes = require('./routes/protected');
const userRoutes = require('./routes/user');

// 5. Express 앱 생성
const app = express();

// 6. 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 7. 정적 파일 제공 (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// 8. 라우터 경로 설정
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/users', userRoutes);

// 9. MongoDB 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1); // 연결 실패 시 서버 종료
});

// 10. 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});