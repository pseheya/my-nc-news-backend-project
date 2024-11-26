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
    .query(
      "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url FROM articles WHERE article_id = $1",
      value
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

// exports.readArticleByIdV2 = async (id) => {
//   const articles = await db.query(
//     "SELECT * FROM articles WHERE article_id = $1",
//     [id]
//   );
//   if (articles.rows.length === 0) {
//     return Promise.reject({ status: 404, msg: "Not found" });
//   }
//   return articles.rows[0];
// };

exports.readArticles = () => {
  let text = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
    FROM articles
    JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`;

  return db.query(text).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return rows;
  });
};

exports.readCommentsByArticleId = (id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY comments.created_at ASC",
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows;
    });
};
