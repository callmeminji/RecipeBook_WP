// app.js

const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// 라우터 import
const commentRoutes = require('./routes/comment');
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipe');
const protectedRoutes = require('./routes/protected');
const userRoutes = require('./routes/user');

const app = express();

// 미들웨어
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 라우터 등록
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/users', userRoutes);

module.exports = app; // ✅ 테스트용 export
