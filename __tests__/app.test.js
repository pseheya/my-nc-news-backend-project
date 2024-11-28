const endpointsJson = require("../endpoints.json");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app.js");
require("jest-sorted");

const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index.js");

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("Wrong URL path", () => {
  test("404: respond with message 'Not found', if the URL path is not valisd", () => {
    return request(app)
      .get("/notAValidUrl")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/topics ", () => {
  test("200: Responds with an object with all topics and the object should have properties: slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
          expect(body.topics[0]).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Respond with one object from article table, and the object should have id that we passed in URL", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 1,
          topic: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("404: Respond with message 'Not found' if id is valid but not exist in database", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400: Respond with message 'Bad request' if id in URL is not valid", () => {
    return request(app)
      .get("/api/articles/notAValidId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Respond with objects that count commends for every article, and sorted it in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(10);
        body.articles.forEach((article) => {
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(Number),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Respond with all commebts for ab article we passing in", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toHaveLength(2);
        body.comment.forEach((comments) => {
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 3,
          });
          expect(body.comment).toBeSortedBy("created_at");
        });
      });
  });
  test("404: Respond with message 'Not found' if id is valid but not exist in database", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400: Respond with message 'Bad request' if id in URL is not valid", () => {
    return request(app)
      .get("/api/articles/notAValidId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Respond with new object that contains article_id, username, body, comment, when user is exist in users table", () => {
    const newComment = {
      username: "icellusedkars",
      body: "They can do it better, but it is what it is",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          article_id: 2,
          author: "icellusedkars",
          body: "They can do it better, but it is what it is",
        });
      });
  });
  test("404: Respond with msg 'Bad request', if article_id is valid but not exist", () => {
    const newComment = {
      username: "icellusedkars",
      body: "They can do it better, but it is what it is",
    };

    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Respond with msg 'Bad request', when user name is not exist in database", () => {
    const newComment = {
      username: "Marria",
      body: "They can do it better, but it is what it is",
    };

    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Respond with update votes in object when article_id is exist", () => {
    const newVote = { inc_votes: 5 };

    return request(app)
      .patch("/api/articles/2")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: expect.any(String),
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 5,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("200: Respond with update votes in article, when votes less than 0", () => {
    const newVote = { inc_votes: -100 };

    return request(app)
      .patch("/api/articles/2")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: expect.any(String),
          created_at: "2020-10-16T05:03:00.000Z",
          votes: -100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("404: Respond with msg 'Not Found', when user name is not exist in database", () => {
    const newVote = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/2000")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400: Respond with msg 'Bad request' if article_id is not a number", () => {
    const newVote = { inc_votes: 99 };

    return request(app)
      .patch("/api/articles/iAmNotANumber")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Respond with msg 'Bad request' if votes we are passing is not a number", () => {
    const newVote = { inc_votes: "I am not a number" };

    return request(app)
      .patch("/api/articles/2")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Respond with No content, body should be an empty object", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("204, 404: Respond with status 204, and 404,  return a message that comment is not found", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});

        return request(app).get("/api/comments/1").expect(404);
      })
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("404: Respond with message that id is not found", () => {
    return request(app)
      .delete("/api/comments/9588475")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Respond with object from users table. All objects should include properies: username, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
        body.users.forEach((user) => {
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("500: Respond with server error when it is something wrong with databse", () => {
    const spy = jest
      .spyOn(db, "query")
      .mockRejectedValueOnce(new Error("Failed to connecting to database"));

    return request(app)
      .get("/api/users")
      .expect(500)
      .then(({ body }) => {
        expect(body.msg).toBe("Server Error");
      })
      .then(() => {
        spy.mockRestore();
      });
  });
});

describe("GET /api/articles (sorting queries)", () => {
  test("200: Respond with object that sorted_by created_at by default in desc order", () => {
    return request(app)
      .get("/api/articles?sorted_by")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(10);
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: Respond with object that sorted_by topic, in asc order", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=ASC")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(10);
        expect(body.articles).toBeSortedBy("topic");
      });
  });
  test("200: Responds with objects that sorted_by topic in desc order", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=DESC")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(10);
        expect(body.articles).toBeSortedBy("topic", { descending: true });
      });
  });
  test("400: Respond with message that sorted_by is not valid", () => {
    return request(app)
      .get("/api/articles?sort_by=banana&order=DESC")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Sort_by is not valid");
      });
  });
  test("400: Respond with message that order is not valid", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Order is not valid");
      });
  });
});

describe("GET /api/articles (topic query)", () => {
  test("200: Respond with object that sorted_by created_at by default in desc order,and topic =cats", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(1);
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
        body.articles.forEach((article) => {
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: "cats",
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("404: Respond with message 'Not found' if this topic is not exist in the articles", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("This topic is not exist");
      });
  });
  test("400: Respond with message 'Topic is not valid' when we passing a SQL injection words", () => {
    return request(app)
      .get("/api/articles?topic=DELETE * FROM articles")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic is not valid");
      });
  });
  test("200: Return an empty object when topic is exist but not attached to any articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Respond with one object from article table, and the object should include now a comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 1,
          topic: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(String),
        });
      });
  });
  test("404: Respond with message 'Not found' if id is valid but not exist in database", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: Respond with object contain user that has this username", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual(
          expect.objectContaining({
            username: "lurker",
            name: "do_nothing",
            avatar_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          })
        );
      });
  });
  test("404: Respond with message 'This user does not exist in database' if user does not exist", () => {
    return request(app)
      .get("/api/users/margo")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("This user does not exist in database");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("201: Respond with updated votes in comment, by comment_id, when votes grater than 0", () => {
    const newVote = { inc_votes: 100 };

    return request(app)
      .patch("/api/comments/2")
      .send(newVote)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          body: expect.any(String),
          votes: 114,
          author: "butter_bridge",
          article_id: 1,
          created_at: expect.any(String),
        });
      });
  });

  test("201: Respond with updated votes in comment, by comment_id, when votes grater than 0", () => {
    const newVote = { inc_votes: -100 };

    return request(app)
      .patch("/api/comments/2")
      .send(newVote)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          body: expect.any(String),
          votes: -86,
          author: "butter_bridge",
          article_id: 1,
          created_at: expect.any(String),
        });
      });
  });

  test('404: Respond with "This comment does not exist" when id is valid but not exist in db', () => {
    const newVote = { inc_votes: 100 };

    return request(app)
      .patch("/api/comments/999")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("This comment does not exist");
      });
  });

  test("400: Respond with 'Bad request', when inc_votes' is not a number", () => {
    const newVote = { inc_votes: "I am not a number" };

    return request(app)
      .patch("/api/comments/999")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles", () => {
  test("201: Respond with new article object, including article_id, votes, created_at, comment_count, if topic and author is exist", () => {
    const newArticle = {
      title: "Hi! Its my first article",
      topic: "mitch",
      author: "butter_bridge",
      body: "Every day we are stronger and better",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          title: "Hi! Its my first article",
          topic: "mitch",
          author: "butter_bridge",
          body: "Every day we are stronger and better",
          article_id: expect.any(Number),
          votes: 0,
          comment_count: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("400: Respond with msg Bad request if user does not exist", () => {
    const newArticle = {
      title: "Hi! Its my first article",
      topic: "cats",
      author: "Katty",
      body: "Every day we are stronger and better",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Respond with msg Bad request if topic does not exist", () => {
    const newArticle = {
      title: "Hi! Its my first article",
      topic: "banana",
      author: "butter_bridge",
      body: "Every day we are stronger and better",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Respond with msg Bad request if properies from body missed", () => {
    const newArticle = {
      body: "Every day we are stronger and better",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles (pagination)", () => {
  test("200: Respond with object that takes a limit of articles and return this in fistr page by default", () => {
    return request(app)
      .get("/api/articles?limit=5")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(5);
        expect(body.total_count).toBe(13);
      });
  });
});
