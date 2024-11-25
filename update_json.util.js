const fs = require("fs");

const updateEndpoits = (req, body) => {
  const method = req.method;
  const route = req.originalUrl;
  const routeWithMethod = `${method} ${route}`;

  fs.readFile(__dirname + "/endpoints.json", "utf-8", (err, data) => {
    if (err) {
      console.log("You need to check reading the file");
      throw err;
    }

    let endpoints;

    try {
      endpoints = JSON.parse(data);
    } catch (err) {
      throw err;
    }

    if (endpoints[routeWithMethod]) {
      return;
    }

    endpoints[routeWithMethod] = {
      description: `serves an array of all ${route}`,
      queries: [],
      exampleResponse: body,
    };

    fs.writeFile(
      __dirname + "/endpoints.json",
      JSON.stringify(endpoints, null, 2),
      (err) => {
        if (err) {
          console.log(err, "Something wrong with writing a file");
        } else {
          console.log("File update successfully");
        }
      }
    );
  });
};

module.exports = updateEndpoits;
