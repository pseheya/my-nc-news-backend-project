const fs = require("fs");

const updateEndpoits = (req, res, next) => {
  const method = req.method;
  const route = req.originalUrl;
  const routeWithMethod = `${method} ${route}`;

  fs.readFile(__dirname + "/endpoints.json", "utf-8", (err, data) => {
    if (err) {
      console.log("You need to check reading the file", err);
      return next();
    }

    let endpoints;

    try {
      endpoints = JSON.parse(data);
    } catch (err) {
      console.log("Error parsing JSON data:", err);
      return next();
    }

    if (endpoints[routeWithMethod]) {
      console.log(
        `Example for this route ${route} is already exist in JSON file`
      );
      next();
    }
    endpoints[routeWithMethod] = {
      description: `serves an array of all ${route}`,
      queries: [],
      exampleResponse: res.body,
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

        next();
      }
    );
  });
};

module.exports = updateEndpoits;
