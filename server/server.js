// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const protectedRoutes = require('./routes/protected');

const app = express();

app.use('/api/protected', protectedRoutes);

dotenv.config();
require('dotenv').config();


// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서비스
app.use(express.static(path.join(__dirname, 'public')));


// 라우터 연결
const testRoutes = require('./routes/test');
app.use('/api/test', testRoutes);

const authRoutes = require('./routes/auth'); // ✅ 수정 완료
app.use('/api/auth', authRoutes);

// DB 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
