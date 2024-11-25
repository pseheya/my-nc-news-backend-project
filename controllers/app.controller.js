const endpointsJson = require("../endpoints.json");

exports.getApiDocumentation = (req, res, next) => {
  res.status(200).send({ endpoints: endpointsJson });
};
