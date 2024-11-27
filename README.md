# Northcoders News API

Hosted Version
-You can view the hosted version of the NC News API at the following link:
https://my-nc-news-backend-project.onrender.com/

      1. Description

This is the backend of a news aggregation API, built with Node.js and PostgreSQL. It allows users to interact with news articles, categories, and comments in a simple, RESTful interface.

The API is designed to be used by a front-end application or by other developers wishing to integrate it into their own projects.

      2. Requirements

-Node.js (minimum version: v14.x.x)
-PostgreSQL (minimum version: v12.x.x)
-Make sure both are installed before running the project locally.

      3. Getting Started

Clone the Repository
To get started with this project, first clone the repository to your local machine.

      4. Install Dependencies

Next, you’ll need to install the project dependencies.
-npm install

If you prefer yarn, you can use:
-npm install

      5. Set Up Environment Variables

To run the project locally, you'll need to create two .env files: .env.development and .env.test. These files store sensitive information like your database connection strings and API keys.

- Create .env.development:
  This file is for your local development environment.

PGDATABASE=nc_news

- Create .env.test:
  This file is for your testing environment.

PGDATABASE=nc_news_test

This is similar to the development file but for running tests with a separate test database.

- Create a database in you local machine:
  To create this database you need to run this command:
  npm run setup-dbs

- Seed the Database
  To populate the database with the initial data (e.g., categories, users, articles), run the following command:

npm run seed
This will seed the database with the necessary data for testing and development.

- Run Tests
  If you want to run tests to ensure everything is working as expected, use:

npm test or npm t
This will run the test suite and display the results in the terminal.

- Running the Project
  To start the server and begin using the API, run:

npm start
By default, the server will be running on port 9090, but this can be changed by setting port in listen.js file.

- Endpoints

Once the server is running, you can interact with the API by sending HTTP requests to the following endpoints (example):

GET /api/articles: Fetch all articles
GET /api/categories: Fetch all categories
GET /api/articles/:article_id: Fetch article by article_id, you need replace ":article_id" to number

- Example Requests
  Here's an example of how to make a request to the API using cURL:

Notes:
If you're using Yarn and prefer not to use it globally, you can install it locally with:

npm install --global yarn
Ensure that the PostgreSQL server is running on your machine before starting the application.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
