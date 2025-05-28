const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서비스: public 폴더 (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// 테스트 라우터 연결
// ❌ 기존 잘못된 경로: './server/routes/test'
// ✅ 맞는 경로로 수정 필요 (만약 test.js 있으면 아래 주석 풀어줘)
// const testRoutes = require('./routes/test');
// app.use('/api/test', testRoutes);

// ✅ 레시피 라우터 연결 - 너가 만든 파일 기준
const recipeRoutes = require('./routes/recipe');
app.use('/api/recipes', recipeRoutes);

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
  console.log(` Server running on http://localhost:${PORT}`);
});

console.log('🌱 MONGO_URI:', process.env.MONGO_URI);
