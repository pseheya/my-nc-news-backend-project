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
          // body: expect.any(String),
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
        expect(body.articles).toHaveLength(5);
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

  test("404: Respond with msg 'Not found', if URL path is not valid", () => {
    const newComment = {
      username: "Marria",
      body: "They can do it better, but it is what it is",
    };

    return request(app)
      .post("/api/articles/999/notAValidURl")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("404: Respond with msg 'Bad request', when user name is not exist in database", () => {
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
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
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
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: -100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400: Respond with msg 'Not Found', when user name is not exist in database", () => {
    const newVote = { inc_votes: 5 };

    return request(app)
      .patch("/api/articles/2000")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
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
  test("404: Respond with message not found if it is wrong URL", () => {
    return request(app)
      .get("/api/wrongUrlForUser")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
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
