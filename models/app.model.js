const { rows, user } = require("pg/lib/defaults");
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

exports.readArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const validSortBy = ["created_at", "title", "topic", "author", "votes"];
  const validOrder = ["ASC", "DESC"];
  const dangerousKeywords =
    /(\bDROP\b|\bDELETE\b|\bINSERT\b|\bUPDATE\b|\bSELECT\b|\bALTER\b|\bTRUNCATE\b|\bEXEC\b|\b--|;|\/\*)/i;
  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Sort_by is not valid" });
  }

  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Order is not valid" });
  }

  if (dangerousKeywords.test(topic)) {
    return Promise.reject({ status: 400, msg: "Bed request" });
  }

  const queryValues = [];

  let sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
    FROM articles
     JOIN comments ON articles.article_id = comments.article_id `;

  if (topic !== undefined) {
    sqlQuery += `WHERE articles.topic = $1 `;
    queryValues.push(topic);
  }

  sqlQuery += `GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}`;
  return db.query(sqlQuery, queryValues).then(({ rows }) => {
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

exports.readCommentsByCommentId = (id) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1", [id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};

exports.createCommentById = (article_id, username, body) => {
  const values = [body, article_id, username];
  const sqlQuery =
    "INSERT INTO comments (body, article_id, author) VALUES($1, $2, $3) RETURNING comment_id, article_id, author, body, votes, created_at;";

  return db.query(sqlQuery, values).then(({ rows }) => {
    return rows;
  });
};

exports.updateVotesByArticleId = (id, inc_votes) => {
  const values = [Math.abs(inc_votes), id];
  let operator = inc_votes > 0 ? "+" : "-";

  let sqlQuery = `UPDATE articles SET votes = votes ${operator} $1 WHERE article_id = $2 RETURNING *`;

  return db.query(sqlQuery, values).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return rows[0];
  });
};

exports.findCommentByCommentId = (id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1`, [id])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
    });
};

exports.readAllUsers = () => {
  return db
    .query("SELECT * FROM users")
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Users are not found" });
      }
      return rows;
    })
    .catch((err) => {
      return Promise.reject(new Error("Server Error"));
    });
};
