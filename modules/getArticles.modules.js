const db = require('../db/connection');

exports.selectArticleById = async (article_id) => {
  const res = await db.query(
    `SELECT articles.article_id,
      title,
      topic,
      articles.author,
      articles.body,
      articles.created_at,
      articles.votes,
      count(comments.body)
      AS comment_count
      FROM articles 
      JOIN comments 
      ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1 
      GROUP BY articles.article_id;`,
    [article_id]
  );

  const data = res.rows[0];

  return data;
};

exports.updatedItem = async (article_id, inc_votes) => {
  const text = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`;

  const res = await db.query(text, [inc_votes, article_id]);

  return res.rows[0];
};

exports.selectArticles = async () => {
  const res = await db.query(`
  SELECT articles.article_id,
      title,
      topic,
      articles.author,
      articles.created_at,
      articles.votes,
      count(comments.article_id)
      AS comment_count
      FROM articles 
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id       
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;
  `);

  const data = res.rows;

  return data;
};

exports.addNewComment = async (article_id, author, body) => {
  const res = await db.query(
    `INSERT INTO comments (body, article_id, author, created_at) VALUES ($1, $2, $3, current_timestamp) RETURNING *`,
    [body, article_id, author]
  );

  const data = res.rows[0];
  return data;
};
