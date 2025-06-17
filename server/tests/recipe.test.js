const request = require('supertest');
const app = require('../app'); // 너의 Express 앱이 있는 파일 import
const mongoose = require('mongoose');

describe('GET /api/recipes', () => {
  beforeAll(async () => {
    // MongoDB 연결 설정
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recipeya_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return all recipes with status 200', async () => {
    const res = await request(app).get('/api/recipes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
