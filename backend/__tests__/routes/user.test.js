// __tests__/routes/user.test.js
const request = require('supertest');
const app = require('../../app');
const db = require('../setup/db');

beforeAll(async () => {
  await db.connect();
});

beforeEach(async () => {
  await db.resetDatabase();
});

afterAll(async () => {
  await db.close();
});

describe('User Routes', () => {
  it('GET /api/users should return empty array after reset', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/users should insert and retrieve user', async () => {
    const user = { name: 'Test User', email: 'test@example.com' };
    const postRes = await request(app).post('/api/users').send(user);
    expect(postRes.statusCode).toBe(201);

    const getRes = await request(app).get('/api/users');
    expect(getRes.body.length).toBe(1);
    expect(getRes.body[0]).toMatchObject(user);
  });
});
