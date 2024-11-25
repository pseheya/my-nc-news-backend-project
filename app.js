const express = require("express");
const app = express();
const {
  getApiDocumentation,
  getAllTopics,
} = require("./controllers/app.controller");
const {
  sqlErrors,
  custumError,
  serverError,
  unmatchRouts,
} = require("./error.handling");

const updateEndpoits = require("./update_json.util");

app.use(express.json());

app.get("/api", getApiDocumentation);

app.get("/api/topics", getAllTopics);

app.use((req, res, next) => {
  if (res.headersSent && req.originalUrl.startsWith("/api")) {
    updateEndpoits(req, res, next);
  }
  next();
});
app.use(sqlErrors);
app.use(custumError);
app.use(unmatchRouts);
app.use(serverError);

module.exports = app;
