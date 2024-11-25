const db = require("../db/connection");
const format = require("pg-format");

exports.readAllTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.readArticleByID = (id) => {
  const value = [id];

  return db
    .query("SELECT * FROM articles WHERE article_id = $1", value)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};
