const db = require('../db/connection');

exports.selectUsers = async () => {
  const res = await db.query('SELECT username FROM users');
  const data = res.rows;

  return data;
};
