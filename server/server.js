// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// 라우터 파일 불러오기
const commentRoutes = require('./routes/comment');
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipe');
const protectedRoutes = require('./routes/protected');
const userRoutes = require('./routes/user');


// 환경변수 설정 (.env 파일 로딩)
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express(); 

// 요청 바디 파싱 설정 (JSON, URL-encoded 데이터 처리)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 정적 파일 제공 (예: HTML, CSS, JS 등)
app.use(express.static(path.join(__dirname, 'public')));
// 정적 이미지 제공
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// API 경로별 라우터 연결 (app 선언 이후에!)
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/users', userRoutes);

// MongoDB 데이터베이스 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
