const userRouter = require("express").Router();
const {
  getAllUsers,
  getUserByUserName,
  getAllArticlesByUserName,
  getAllCommentsByUserName,
} = require("../controllers/app.controller");

userRouter.get("/", getAllUsers);
userRouter.get("/:username", getUserByUserName);
userRouter.get("/:username/articles", getAllArticlesByUserName);
userRouter.get("/:username/comments", getAllCommentsByUserName);

module.exports = userRouter;
