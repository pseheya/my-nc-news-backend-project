const userRouter = require("express").Router();
const {
  getAllUsers,
  getUserByUserName,
} = require("../controllers/app.controller");

userRouter.get("/", getAllUsers);
userRouter.get("/:username", getUserByUserName);

module.exports = userRouter;
