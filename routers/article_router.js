const articleRouts = require("express").Router();
const {
  getArticleById,
  getArticles,
  patchVotesByArticleId,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/app.controller");

articleRouts.get("/:article_id", getArticleById);
articleRouts.get("/", getArticles);
articleRouts.patch("/:article_id", patchVotesByArticleId);
articleRouts.get("/:article_id/comments", getCommentsByArticleId);
articleRouts.post("/:article_id/comments", postCommentByArticleId);

module.exports = articleRouts;
