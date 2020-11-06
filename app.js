"use strict";

const userRoutes = require("./routes/user.js");
const courseRoutes = require("./routes/course.js");

// load modules
const express = require("express");
const morgan = require("morgan");

// variable to enable global error logging
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

const { sequelize } = require("./models");

// create the Express app
const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// setup morgan which gives us http request logging
app.use(morgan("dev"));

(async () => {
  try {
    // Test connection to the database
    await sequelize.authenticate();
    console.log("Connection to the database succesful.");
    // Sync models
    await sequelize.sync();
    console.log("Syncing models with the database.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
})();

// setup a friendly greeting for the root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the REST API project!",
  });
});

// Add routes
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    const errors = err.errors.map((err) => err.message);
    res.status(400).json({ errors });
  }
  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set("port", process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get("port"), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
