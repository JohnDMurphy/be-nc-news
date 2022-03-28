const db = require('../db/connection');

exports.selectTopics = async () => {
  const res = await db.query('SELECT * FROM topics');
  const data = res.rows;

  return data;
};
