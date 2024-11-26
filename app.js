const express = require("express");
const app = express();
const {
  getApiDocumentation,
  getAllTopics,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchVotesByArticleId,
  deleteCommentByCommentID,
  getCommentsById,
  getAllUsers,
} = require("./controllers/app.controller");
const {
  sqlErrors,
  custumError,
  serverError,
  unmatchRouts,
} = require("./error.handling");
const { updateVotesByArticleId } = require("./models/app.model");

app.use(express.json());

app.get("/api", getApiDocumentation);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.get("/api/comments/:comment_id", getCommentsById);

app.get("/api/users", getAllUsers);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchVotesByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentByCommentID);

app.use(sqlErrors);
app.use(custumError);
app.use(unmatchRouts);
app.use(serverError);

module.exports = app;
