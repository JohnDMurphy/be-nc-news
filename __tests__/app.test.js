const request = require('supertest');
const app = require('../app');
const testData = require('../db/data/test-data');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe('nc-be-news-app', () => {
  describe('GET /api/topics', () => {
    it('Should return a 200 with an array of topic objects', async () => {
      const { body } = await request(app).get('/api/topics').expect(200);

      const topics = body.topics;
      // check its an array
      expect(topics).toBeInstanceOf(Array);
      // Check the array is not empty
      expect(topics.length === 3).toBe(true);
      // Check topics data types are correct
      topics.forEach((topic) => {
        expect(typeof topic.slug).toBe('string');
        expect(typeof topic.description).toBe('string');
      });
    });

    it('Should return a 404 with an incorrect path', async () => {
      const { body } = await request(app).get('/api/notAPath').expect(404);
      expect(body.msg).toBe('Route not found!');
    });
  });

  describe('GET /api/articles/:article_id', () => {
    it('Should return an article object with the id given', async () => {
      const { body } = await request(app).get('/api/articles/1').expect(200);

      expect(body.article).toBeInstanceOf(Object);

      expect(body.article.article_id).toBe(1);

      expect(body.article).toEqual({
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: '2020-07-09T20:11:00.000Z',
        votes: 100,
      });
    });

    it('Should return a 400 error if given wrong type for input id', async () => {
      const { body } = await request(app)
        .get('/api/articles/words')
        .expect(400);
      expect(body.msg).toBe('Incorrect Input Type');
    });

    it('Should give a 404 error if id is not in the database', async () => {
      const { body } = await request(app).get('/api/articles/100').expect(404);
      expect(body.msg).toBe('the given ID does not exist');
    });
  });

  // describe('GET /api/users', () => {
  //   it('Should return an array of objects with a username property', async () => {
  //     const { body } = await request(app).get('/api/users').expect(200);

  //     const users = body.users;
  //     // check its an array
  //     expect(users).toBeInstanceOf(Array);
  //     // Check the array is not empty
  //     expect(users.length === 4).toBe(true);
  //     // Check users data type is correct
  //     users.forEach((user) => {
  //       expect(typeof user.username).toBe('string');
  //     });
  //   });
  // });
});
