const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const morgan = require("morgan");
const Authroute = require("./routes/auth.route");
const createError = require("http-errors");
require("./helpers/init_mongodb");
const userModel = require("./models/user.model");
const { verifyAccessToken } = require("./helpers/jwt_helper");
const cors = require("cors");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON request bodies

app.use(morgan("dev")); // Log HTTP requests to the console
app.use("/Auth", Authroute); // Mount the authentication routes

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
