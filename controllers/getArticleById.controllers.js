const { selectArticleById } = require('../modules/getArticles.modules.js');

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
