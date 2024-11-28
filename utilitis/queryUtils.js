exports.isImputNumber = (number) => {
  if (typeof number !== number) {
    return Promise.reject({
      status: 400,
      msg: "Limit or page is not a number",
    });
  }
  if (number < 0) {
    return Promise.reject({
      status: 400,
      msg: "Limit or page shoul be grater 0",
    });
  }
};
