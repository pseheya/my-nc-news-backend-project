const express = require("express");
const app = express();
const cors = require("cors");

const {
  sqlErrors,
  custumError,
  serverError,
  unmatchRouts,
} = require("./error-handling/error.handling");

app.use(cors());
const apiRouter = require("./routers/router");

app.use(express.json());
app.use("/api", apiRouter);

app.use(sqlErrors);
app.use(custumError);
app.use(unmatchRouts);
app.use(serverError);

module.exports = app;
