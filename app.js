const express = require("express");
const app = express();
const {
  getApiDocumentation,
  getAllTopics,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
} = require("./controllers/app.controller");
const {
  sqlErrors,
  custumError,
  serverError,
  unmatchRouts,
} = require("./error.handling");

app.use(express.json());

app.get("/api", getApiDocumentation);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.use(sqlErrors);
app.use(custumError);
app.use(unmatchRouts);
app.use(serverError);

module.exports = app;
