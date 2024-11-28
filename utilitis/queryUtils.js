exports.isValidLimit = (limit, p) => {
  if (isNaN(limit)) {
    return Promise.reject({
      status: 400,
      msg: "Limit is not a number",
    });
  }
  if (typeof Number(p) !== "number") {
    return Promise.reject({
      status: 400,
      msg: "Page is not a number",
    });
  }
  if (Number(limit) < 0) {
    return Promise.reject({
      status: 400,
      msg: "Limit shoul be greater 0",
    });
  }
  if (Number(p) < 0) {
    return Promise.reject({
      status: 400,
      msg: "Page shoul be greater 0",
    });
  }
};
