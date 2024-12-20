const userRouter = require("express").Router();
const {
  getAllUsers,
  getUserByUserName,
  getAllArticlesByUserName,
} = require("../controllers/app.controller");

userRouter.get("/", getAllUsers);
userRouter.get("/:username", getUserByUserName);
userRouter.get("/:username/articles", getAllArticlesByUserName);

module.exports = userRouter;
