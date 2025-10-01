const request = require('supertest');
const app = require('../../app'); // path to your Express app

describe('User Routes', () => {
  it('GET /api/users should return all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'All users');
  });
});
