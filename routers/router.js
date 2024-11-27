const apiRouter = require("express").Router();
const { getApiDocumentation } = require("../controllers/app.controller");
const userRouter = require("./user_router");
const topicRouter = require("./topic_router");
const articleRouts = require("./article_router");
const commentsRouter = require("./comment_router");

apiRouter.get("/", getApiDocumentation);
apiRouter.use("/users", userRouter);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articleRouts);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
