# Northcoders News API

1. Setting Up the Project

   1. To run this project, you'll need to set up your database and seed the data. Follow the steps below:

   1. Create .env Files:

   You will need to create two environment files: .env.development and .env.test. These files will store the configuration for your development and test databases.
   You can refer to the .env.example file for guidance on how to structure these files.

   2. Install Dependencies:

   All required dependencies are already listed in the package.json file, so there's no need to reinstall them manually. Simply run:
   npm install
   This will automatically install all the dependencies required for the project, including jest, pg, and pg-format.

   3. Setting Up the Databases:

   After setting up the .env.development and .env.test files, you can use the following npm script to create and set up the databases:
   npm run setup-dbs
   This will configure your databases based on the environment files.

   4. Notes on the .env Files:

   The .env.development and .env.test files should contain the necessary database configuration (e.g., host, username, password, etc.). The .env.example file provides an example of the required structure. Be sure to fill in the correct values for your environment.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
