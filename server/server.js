// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// 환경변수 설정
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// 요청 바디 파싱 설정 (JSON, URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서비스 (HTML, CSS, JS 등)
app.use(express.static(path.join(__dirname, 'public')));

// 라우터 불러오기
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipe');
const protectedRoutes = require('./routes/protected');
const userRoutes = require('./routes/user');

// 라우터 연결
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/users', userRoutes);

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
