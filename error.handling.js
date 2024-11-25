exports.sqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(404).send({ msg: "Not found" });
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
  console.log("Unmatched route triggered:", req.originalUrl);
  res.status(404).send({ msg: "Not found" });
};
exports.serverError = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
};
