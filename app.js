const express = require('express');
const { json } = require('express/lib/response');
const { getTopics } = require('./controllers/getTopics.controllers.js');
const {
  getArticleById,
} = require('./controllers/getArticleById.controllers.js');

const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.all('*', (req, res) => {
  res.status(404).send({ msg: 'Route not found!' });
});

app.use((err, req, res, next) => {
  const statusArr = ['22P02'];

  if (statusArr.includes(err.code)) {
    res.status(400).send({ msg: 'Incorrect Input Type' });
  } else if (err.msg === 'the given ID does not exist') {
    res.status(404).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.Status(500).send({ msg: 'Internal server error' });
});

module.exports = app;
