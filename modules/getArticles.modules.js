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

exports.selectArticles = async () => {
  const res = await db.query(`
  SELECT articles.article_id,
      title,
      topic,
      articles.author,
      articles.created_at,
      articles.votes,
      count(comments.body)
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
