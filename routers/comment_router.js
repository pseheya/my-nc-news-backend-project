const commentsRouter = require("express").Router();
const {
  getCommentsById,
  deleteCommentByCommentID,
  patchCommentByCommentId,
} = require("../controllers/app.controller");

commentsRouter.get("/:comment_id", getCommentsById);
commentsRouter.delete("/:comment_id", deleteCommentByCommentID);
commentsRouter.patch("/:comment_id", patchCommentByCommentId);

module.exports = commentsRouter;
