const express = require("express");
const route = express.Router();

const { getHomePageApi } = require("../controllers/homeController");
route.use("/", getHomePageApi);

module.exports = route;
