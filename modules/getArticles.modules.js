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

exports.selectArticles = async (sort_by, order, topic = undefined) => {
  console.log('Still made it ', sort_by, order, topic);

  const validColumns = [
    'title',
    'topic',
    'author',
    'body',
    'created_at',
    'votes',
  ];

  const validOrder = ['asc', 'desc', 'ASC', 'DESC'];

  if (sort_by) {
    let query = {
      text: `SELECT articles.article_id,
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
     `,
    };

    if (topic !== undefined) {
      query.text += 'WHERE topic = $1 ';
      query.values = [topic];
    }

    query.text += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

    const res = await db.query(query);
    const data = res.rows;
    console.log(data);
    if (!data.length) {
      return Promise.reject({ msg: 'No content', status: 204 });
    }

    return data;
  } else {
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
  }
};

exports.selectCommentsByArticle = async (article_id) => {
  const res = await db.query(
    ` SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1;`,
    [article_id]
  );

  const data = res.rows;

  return data;
};

exports.addNewComment = async (article_id, author, body) => {
  if (typeof author !== 'string' || typeof body !== 'string') {
    return Promise.reject({ status: 400, msg: 'Incorrect Input Type' });
  } else {
    const res = await db.query(
      `INSERT INTO comments (body, article_id, author, created_at) VALUES ($1, $2, $3, current_timestamp) RETURNING *`,
      [body, article_id, author]
    );

    const data = res.rows[0];
    return data;
  }
};
