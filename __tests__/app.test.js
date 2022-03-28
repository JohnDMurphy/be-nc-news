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
    it('Should return a 404 with an incorrect path', async () => {
      const { body } = await request(app).get('/api/notAPath').expect(404);
      expect(body.msg).toBe('Route not found!');
    });

    it('Should return a 200 with an array of topic objects', async () => {
      const { body } = await request(app).get('/api/topics').expect(200);

      const topics = body.topics;
      // check its an array
      expect(topics).toBeInstanceOf(Array);
      // Check the array is not empty
      expect(topics.length);
      // Check topics data types are correct
      topics.forEach((topic) => {
        expect(typeof topic.slug).toBe('string');
        expect(typeof topic.description).toBe('string');
      });
    });
  });
});
