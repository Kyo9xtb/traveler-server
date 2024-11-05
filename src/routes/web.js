const express = require("express");
const route = express.Router();

const { getHomePage } = require("../controllers/homeController");
route.get("/", getHomePage);

module.exports = route;
 