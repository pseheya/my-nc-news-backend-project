const express = require("express");
const app = express();
const { getApiDocumentation } = require("./controllers/app.controller");
const {
  sqlErrors,
  custumError,
  serverError,
  unmatchRouts,
} = require("./error.handling");

app.use(express.json());

app.get("/api", getApiDocumentation);

app.use(sqlErrors);
app.use(custumError);
app.use(unmatchRouts);
app.use(serverError);

module.exports = app;
