const topicRouter = require("express").Router();

const { getAllTopics, addNewTopic } = require("../controllers/app.controller");

topicRouter.get("/", getAllTopics);
topicRouter.post("/", addNewTopic);

module.exports = topicRouter;
