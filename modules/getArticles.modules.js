const db = require('../db/connection');

exports.selectArticleById = async (article_id) => {
  const res = await db.query('SELECT * FROM articles WHERE article_id = $1', [
    article_id,
  ]);

  const data = res.rows[0];

  return data;
};
