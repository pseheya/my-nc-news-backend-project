const commentsRouter = require("express").Router();
const {
  getCommentsById,
  deleteCommentByCommentID,
} = require("../controllers/app.controller");

commentsRouter.get("/:comment_id", getCommentsById);
commentsRouter.delete("/:comment_id", deleteCommentByCommentID);

module.exports = commentsRouter;
