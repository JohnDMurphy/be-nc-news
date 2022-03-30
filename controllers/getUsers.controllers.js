const { selectUsers } = require('../modules/selectUsers.models.js');

exports.getUsers = async (req, res, next) => {
  try {
    const usersData = await selectUsers();

    res.status(200).send({ users: usersData });
  } catch (err) {
    next(err);
  }
};
