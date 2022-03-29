const db = require('../db/connection');

exports.selectArticleById = async (article_id) => {
  const res = await db.query('SELECT * FROM articles WHERE article_id = $1', [
    article_id,
  ]);

  const data = res.rows[0];

  return data;
};

exports.updatedItem = async (article_id, inc_votes) => {
  const text = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`;

  const res = await db.query(text, [inc_votes, article_id]);

  return res.rows[0];
};
