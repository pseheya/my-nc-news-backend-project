exports.sqlErrors = (err, req, res, next) => {
  if (err.code) {
    return res.status(400).send({ msg: "Bad request" });
  }
  next(err);
};

exports.custumError = (err, req, res, next) => {
  if (err.status && err.msg) {
    return res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

exports.unmatchRouts = (req, res, next) => {
  if (req.originalUrl) {
    console.log("Unmatched route triggered:", req.originalUrl);
    res.status(404).send({ msg: "Not found" });
  }
  next(err);
};

exports.serverError = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
};
