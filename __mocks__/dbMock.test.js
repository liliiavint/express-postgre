const supertest = require('supertest');
const app = require('../app');

jest.mock('./db');


describe('GET /transactions', () => {
  test('responds with JSON message', async () => {
        const response = await supertest(app).get('/transactions');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toEqual(20);
    });
  });