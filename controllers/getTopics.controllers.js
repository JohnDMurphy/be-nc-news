const { selectTopics } = require('../modules/getTopics.modules.js');

exports.getTopics = async (req, res, next) => {
  try {
    const topicsData = await selectTopics();

    res.status(200).send({ topics: topicsData });
  } catch (err) {
    next(err);
  }
};
