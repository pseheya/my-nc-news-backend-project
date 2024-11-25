const endpointsJson = require("../endpoints.json");
const updateEndpoits = require("../update_json.util");
const { readAllTopics, readJsonFile } = require("../models/app.model");

exports.getApiDocumentation = (req, res, next) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.getAllTopics = (req, res, next) => {
  readAllTopics()
    .then((topics) => {
      if (!topics) {
        res.status(404).send("Not found");
      }
      res.status(200).send({ topics });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
