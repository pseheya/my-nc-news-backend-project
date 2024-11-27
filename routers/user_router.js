const userRouter = require("express").Router();
const { getAllUsers } = require("../controllers/app.controller");

userRouter.get("/", getAllUsers);

module.exports = userRouter;
