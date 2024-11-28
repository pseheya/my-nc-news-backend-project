const endpointsJson = require("../endpoints.json");
const updateEndpoits = require("../update_json.util");
const {
  readAllTopics,
  readArticleByID,
  readArticles,
  readCommentsByArticleId,
  createCommentById,
  updateVotesByArticleId,
  findCommentByCommentId,
  readCommentsByCommentId,
  readAllUsers,
  readUserByUsername,
  readAndPatchCommentByCommentId,
  addNewArticle,
} = require("../models/app.model");
const { usersData, articleData, topicData } = require("../models/data.models");
const { isImputNumber } = require("../utilitis/queryUtils");
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
  const { comment_count } = req.query;
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
  const { sort_by, order, topic, limit, p } = req.query;
  const promises = [readArticles(sort_by, order, topic, limit, p)];

  if (topic) {
    promises.push(topicData(topic));
  }

  Promise.all(promises)
    .then(([data]) => {
      const totalCount = Number(data.total_count);
      res
        .status(200)
        .send({ articles: data.articles, total_count: totalCount });
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

exports.getCommentsById = (req, res, next) => {
  const { comment_id } = req.params;

  readCommentsByCommentId(comment_id)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllUsers = (req, res, next) => {
  readAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  createCommentById(article_id, username, body)
    .then(([comment]) => {
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

exports.deleteCommentByCommentID = (req, res, next) => {
  const { comment_id } = req.params;
  findCommentByCommentId(comment_id)
    .then(() => {
      updateEndpoits(req);
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByUserName = (req, res, next) => {
  const { username } = req.params;

  readUserByUsername(username)
    .then((user) => {
      updateEndpoits(req, user);
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentByCommentId = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;

  readAndPatchCommentByCommentId(inc_votes, comment_id)
    .then((comment) => {
      updateEndpoits(req, comment);
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewArticle = (req, res, next) => {
  const { title, topic, author, body } = req.body;

  addNewArticle(title, topic, author, body)
    .then((article) => {
      updateEndpoits(req, article);
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
