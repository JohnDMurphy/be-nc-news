const request = require('supertest');
const app = require('../app');
const testData = require('../db/data/test-data');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');

afterAll(() => {
  if (db.end) db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe('nc-be-news-app', () => {
  describe('GET /api/topics', () => {
    it('Should return a 404 with an incorrect path', () => {
      return request(app)
        .get('/api/notAPath')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Route not found!');
        });
    });
  });
});
