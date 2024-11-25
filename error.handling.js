exports.sqlErrors = (err, req, res, next) => {
  if (err.code) {
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

// exports.unmatchRouts = (err, req, res, next) => {
//   console.log("I am here in unmatchRouts");
//   res.status(404).send({ msg: "Not found" });

//   //   next(err);
// };

exports.serverError = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
};
