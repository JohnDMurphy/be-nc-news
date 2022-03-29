const {
  selectArticleById,
  updatedItem,
} = require('../modules/getArticles.modules.js');

exports.getArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;

    const articleData = await selectArticleById(article_id);

    if (articleData === undefined) {
      next({
        status: 404,
        msg: 'the given ID does not exist',
      });
    }
    res.status(200).send({ article: articleData });
  } catch (err) {
    next(err);
  }
};

exports.updateItemById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    const updatedData = await updatedItem(article_id, inc_votes);

    if (updatedData === undefined) {
      next({
        status: 404,
        msg: 'the given ID does not exist',
      });
    }
    res.status(201).send({ article: updatedData });
  } catch (err) {
    next(err);
  }
};
