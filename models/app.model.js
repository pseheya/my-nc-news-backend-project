const { rows, user } = require("pg/lib/defaults");
const db = require("../db/connection");

exports.readAllTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.readArticleByID = (id) => {
  const value = [id];

  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
  COUNT(comments.comment_id) AS comment_count
FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
WHERE articles.article_id = $1
GROUP BY articles.article_id;`,
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

exports.readArticles = async (
  sort_by = "created_at",
  order = "DESC",
  topic,
  limit = 10,
  p = 1
) => {
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
    return Promise.reject({ status: 400, msg: "Topic is not valid" });
  }

  const queryValues = [];

  let sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (topic && topic !== undefined) {
    sqlQuery += `WHERE articles.topic = $3 `;
  }

  sqlQuery += `GROUP BY articles.article_id 
    ORDER BY ${sort_by} ${order}`;

  let countQuery = `SELECT COUNT(DISTINCT articles.article_id) AS total_count
FROM articles `;

  let countQueryValues = [];
  if (topic && topic !== undefined) {
    countQuery += `WHERE articles.topic = $1 `;
    countQueryValues.push(topic);
  }

  const totalCount = await db.query(countQuery, countQueryValues);
  const totalCountOfArticle = totalCount.rows[0].total_count;

  sqlQuery += ` LIMIT $1 OFFSET $2`;
  queryValues.push(Number(limit), (Number(p) - 1) * Number(limit));

  if (topic && topic !== undefined) {
    queryValues.push(topic);
  }

  const sqlRequest = await db.query(sqlQuery, queryValues);
  return { articles: sqlRequest.rows, total_count: totalCountOfArticle };
};

exports.readCommentsByArticleId = (id, limit = 10, p = 1) => {
  let sqlQuery = `SELECT * FROM comments WHERE article_id = $1 ORDER BY comments.created_at ASC LIMIT $2 OFFSET $3`;
  const values = [id, Number(limit), (Number(p) - 1) * Number(limit)];
  return db.query(sqlQuery, values).then(({ rows }) => {
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
  return db.query("SELECT * FROM users").then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Users are not found" });
    }
    return rows;
  });
};

exports.readUserByUsername = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "This user does not exist in database",
        });
      }
      return rows[0];
    });
};

exports.readAndPatchCommentByCommentId = (inc_votes, id) => {
  const values = [Math.abs(inc_votes), id];
  let operator = inc_votes > 0 ? "+" : "-";

  return db
    .query(
      `UPDATE comments SET votes = votes ${operator} $1 WHERE comment_id = $2 RETURNING *`,
      values
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "This comment does not exist",
        });
      }
      return rows[0];
    });
};

exports.addNewArticle = (title, topic, author, body) => {
  const values = [title, topic, author, body];
  return db
    .query(
      `INSERT INTO articles (title, topic, author, body) VALUES($1, $2, $3, $4)
       RETURNING *`,
      values
    )
    .then(({ rows }) => {
      return { ...rows[0], comment_count: 0 };
    });
};

exports.patchNewTopic = (slug, description) => {
  if (!slug || !description) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(
      `INSERT INTO topics (slug, description) VALUES($1, $2)
       RETURNING *`,
      [slug, description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
