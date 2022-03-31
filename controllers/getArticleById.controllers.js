const {
  selectArticleById,
  updatedItem,
  selectArticles,
  addNewComment,
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

    if (inc_votes === undefined) {
      next({
        status: 400,
        msg: 'There was a problem with the input name',
      });
    } else {
      const updatedData = await updatedItem(article_id, inc_votes);

      if (updatedData === undefined) {
        next({
          status: 404,
          msg: 'the given ID does not exist',
        });
      } else {
        res.status(200).send({ article: updatedData });
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  try {
    const articleData = await selectArticles();

    res.status(200).send({ articles: articleData });
  } catch (err) {
    next(err);
  }
};

exports.postCommentById = async (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  const postedData = await addNewComment(article_id, username, body);
};
