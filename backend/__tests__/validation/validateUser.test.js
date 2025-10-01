const { request } = require('express');
const app = require('../../server'); // path to your Express app

describe('GET /user/authenticate', () => {
  // normal Conditions


  // negative Conditions

  // no body present
  test('should respond with 400 Malformed Data', async () => {
    const res = await request(app).get("/user/authenticate")
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({error: 'Malformed data'})
  })
  // edge conditions
});
