const endpointsJson = require("../endpoints.json");
const updateEndpoits = require("../update_json.util");
const {
  readAllTopics,
  readArticleByID,
  readArticles,
} = require("../models/app.model");

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
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  readArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
