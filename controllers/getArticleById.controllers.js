const {
  selectArticleById,
  updatedItem,
  selectArticles,
  selectCommentsByArticle,
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
    } else {
      res.status(200).send({ article: articleData });
    }
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
  const { sort_by, order, topic } = req.query;

  try {
    const articleData = await selectArticles(sort_by, order, topic);

    res.status(200).send({ articles: articleData });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const { article_id } = req.params;

    const commentsData = await selectCommentsByArticle(article_id);

    if (commentsData.length === 0) {
      next({
        status: 404,
        msg: 'the given ID does not exist or does not have any comments',
      });
    } else {
      res.status(200).send({ comments: commentsData });
    }
  } catch (err) {
    next(err);
  }
};

exports.postCommentById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { author, body } = req.body;

    const postedData = await addNewComment(article_id, author, body);
    console.log(postedData);

    res.status(201).send({ comment: postedData });
  } catch (err) {
    next(err);
  }
};
