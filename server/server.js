// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') }); // .env 경로 명시

console.log('JWT_SECRET from env:', process.env.JWT_SECRET);

const app = express();

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서비스 (HTML, CSS, JS 포함)
app.use(express.static(path.join(__dirname, 'public')));

// 라우터 연결
const protectedRoutes = require('./routes/protected');
app.use('/api/protected', protectedRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const recipeRoutes = require('./routes/recipe'); // 네가 만든 라우터
app.use('/api/recipes', recipeRoutes);

const userRoutes = require('./routes/user');
app.use('/api', userRoutes); // ✅ 중요!
// DB 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

console.log('🌱 MONGO_URI:', process.env.MONGO_URI);
