const db = require("../db/connection");

exports.usersData = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "User does not exist, you need create a new user or type correct username",
        });
      }
    });
};

exports.articleData = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "This article id does not exist",
        });
      }
    });
};

exports.commentId = (comment_id) => {
  return db
    .query("SELECT * FROM comments WHERE commnet_id = $1", [comment_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "This comment id does not exist",
        });
      }
    });
};

exports.topicData = (topic) => {
  return db
    .query("SELECT * FROM topics WHERE topics.slug = $1", [topic])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "This topic does not exist",
        });
      }
    });
};
