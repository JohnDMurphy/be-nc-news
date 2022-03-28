const express = require('express');
const { json } = require('express/lib/response');
const { getTopics } = require('./controllers/getTopics.controllers.js');

const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);

app.all('*', (req, res) => {
  res.status(404).send({ msg: 'Route not found!' });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;
