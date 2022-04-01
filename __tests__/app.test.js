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

      // Check the call returns an object
      expect(body.article).toBeInstanceOf(Object);
      // Check id is correct
      expect(body.article.article_id).toBe(1);
      // Check the object received is what you should get
      expect(body.article).toEqual({
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: '2020-07-09T20:11:00.000Z',
        votes: 100,
        comment_count: '11',
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

  describe('PATCH /api/article/:article_id', () => {
    it('Should update the votes based on input sent', async () => {
      const { body } = await request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 2 })
        .expect(200);

      // Check an object is returned
      expect(body.article).toBeInstanceOf(Object);
      // Check the object is the returned item with updated value
      expect(body.article.votes).toBe(102);
      // Check no other data has been changed
      expect(body.article).toEqual({
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: '2020-07-09T20:11:00.000Z',
        votes: 102,
      });
    });

    it('Should return a 400 error if given wrong type for input id', async () => {
      const { body } = await request(app)
        .patch('/api/articles/words')
        .send({ inc_votes: 2 })
        .expect(400);

      expect(body.msg).toBe('Incorrect Input Type');
    });

    it('Should give a 404 error if id is not in the database', async () => {
      const { body } = await request(app)
        .patch('/api/articles/100')
        .send({ inc_votes: 2 })
        .expect(404);

      expect(body.msg).toBe('the given ID does not exist');
    });

    it('Should give a 400 error if incorrect data is sent', async () => {
      const { body } = await request(app)
        .patch('/api/articles/1')
        .send({ inc_botes: 2 })
        .expect(400);

      expect(body.msg).toBe('There was a problem with the input name');
    });

    it('Should give a 400 error if incorrect data type is sent', async () => {
      const { body } = await request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 'hi' })
        .expect(400);

      expect(body.msg).toBe('Incorrect Input Type');
    });
  });

  describe('GET /api/users', () => {
    it('Should return an array of objects with a username property', async () => {
      const { body } = await request(app).get('/api/users').expect(200);

      const users = body.users;
      // check its an array
      expect(users).toBeInstanceOf(Array);
      // Check the array is not empty
      expect(users.length === 4).toBe(true);
      // Check users data type is correct
      users.forEach((user) => {
        expect(typeof user.username).toBe('string');
      });
    });

    it('Should return a 404 with an incorrect path', async () => {
      const { body } = await request(app).get('/api/notAPath').expect(404);
      expect(body.msg).toBe('Route not found!');
    });
  });

  describe('GET /api/articles', () => {
    it('Should return an array of articles with comment count included', async () => {
      const { body } = await request(app).get('/api/articles').expect(200);
      const articles = body.articles;

      expect(articles).toBeInstanceOf(Array);
      // Check the array is not empty
      expect(articles.length === 12).toBe(true);
      // Check the ordering is DESC
      console.log(articles);
      expect(articles).toBeSortedBy('created_at', { descending: true });

      articles.forEach((article) => {
        expect(typeof article.comment_count).toBe('string');
        expect(typeof article.votes).toBe('number');
        expect(typeof article.created_at).toBe('string');
        expect(typeof article.author).toBe('string');
        expect(typeof article.topic).toBe('string');
        expect(typeof article.title).toBe('string');
        expect(typeof article.article_id).toBe('number');
        expect(Object.keys(article).length).toBe(7);
      });

      expect(articles[0]).toEqual({
        article_id: 3,
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        created_at: '2020-11-03T09:12:00.000Z',
        votes: 0,
        comment_count: '2',
      });
    });

    it.only('Should return an array sorted by column and ASC or DESC from the inputs provided where topic is also from input', async () => {
      const { body } = await request(app)
        .get('/api/articles?sort_by=votes&order=desc&topic=mitch')
        .expect(200);

      const articles = body.articles;

      expect(articles).toBeInstanceOf(Array);

      expect(articles.length).toBe(11);

      expect(articles).toBeSortedBy('votes', { descending: true });

      expect(articles[0]).toEqual({
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        created_at: '2020-07-09T20:11:00.000Z',
        votes: 100,
        comment_count: '11',
      });

      articles.forEach((article) => {
        expect(article.topic).toBe('mitch');
      });
    });

    it('Should return a 404 with an incorrect path', async () => {
      const { body } = await request(app).get('/api/notAPath').expect(404);
      expect(body.msg).toBe('Route not found!');
    });
  });

  describe('POST /api/articles/:article_id/comments', () => {
    it('Should post a new comment to an article by its id with a username and body', async () => {
      const { body } = await request(app)
        .post('/api/articles/2/comments')
        .send({ author: 'lurker', body: 'Follow the white rabbit...' })
        .expect(201);

      const comment = body.comment;

      //Check you get an object back
      expect(comment).toBeInstanceOf(Object);

      // Check the amount of items in the object is correct
      expect(Object.keys(comment).length).toBe(6);
      //Check that you get what you expect from the object
      expect(comment.body).toBe('Follow the white rabbit...');
      expect(comment.article_id).toBe(2);
      expect(comment.author).toBe('lurker');
      expect(comment.votes).toBe(0);
      expect(comment.comment_id).toBe(19);
      expect(typeof comment.created_at).toBe('string');
    });

    it('Should give a 404 error if id is not in the database', async () => {
      const { body } = await request(app)
        .post('/api/articles/100/comments')
        .send({ author: 'lurker', body: 'Follow the white rabbit...' })
        .expect(404);

      expect(body.msg).toBe('the given ID does not exist');
    });

    it('Should return a 404 with an incorrect path', async () => {
      const { body } = await request(app).get('/api/notAPath').expect(404);
      expect(body.msg).toBe('Route not found!');
    });

    it('Should give a 400 error if incorrect data is sent', async () => {
      const { body } = await request(app)
        .post('/api/articles/1/comments')
        .send({ author: 'lurker', trh: 'Follow the white rabbit...' })
        .expect(400);

      expect(body.msg).toBe('Incorrect Input Type');
    });

    it('Should give a 400 error if incorrect data type is sent', async () => {
      const { body } = await request(app)
        .post('/api/articles/1/comments')
        .send({ author: 123, body: 1 })
        .expect(400);

      expect(body.msg).toBe('Incorrect Input Type');
    });
  });
});
