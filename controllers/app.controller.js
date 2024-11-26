const endpointsJson = require("../endpoints.json");
const updateEndpoits = require("../update_json.util");
const {
  readAllTopics,
  readArticleByID,
  readArticles,
  readCommentsByArticleId,
  createCommentById,
  updateVotesByArticleId,
} = require("../models/app.model");
const { usersData, articleData } = require("../models/data.models");
const { user } = require("pg/lib/defaults");

exports.getApiDocumentation = (req, res, next) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.getAllTopics = (req, res, next) => {
  readAllTopics()
    .then((topics) => {
      if (!topics) {
        res.status(404).send("Not found");
      }
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  readArticleByID(article_id)
    .then((article) => {
      updateEndpoits(req, article);
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  readArticles()
    .then((articles) => {
      updateEndpoits(req, articles);
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  readCommentsByArticleId(article_id)
    .then((comment) => {
      updateEndpoits(req, comment);
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  const promises = [createCommentById(article_id, username, body)];
  if (username) {
    promises.push(usersData(username));
  }
  if (article_id) {
    promises.push(articleData(article_id));
  }

  Promise.all(promises)
    .then(([[comment]]) => {
      updateEndpoits(req, comment);
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotesByArticleId = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  const promises = [updateVotesByArticleId(article_id, inc_votes)];

  if (article_id) {
    promises.push(articleData(article_id));
  }

  Promise.all(promises)
    .then(([article]) => {
      updateEndpoits(req, article);
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
