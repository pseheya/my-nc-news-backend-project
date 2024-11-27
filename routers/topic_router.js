const topicRouter = require("express").Router();

const { getAllTopics } = require("../controllers/app.controller");

topicRouter.get("/", getAllTopics);

module.exports = topicRouter;
