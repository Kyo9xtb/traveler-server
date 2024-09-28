const path = require("path");
const express = require("express");
const configViewEngine = (app) => {
  // console.log("====> check drirname file view", path.join("./src", "views"));
  app.set("views", path.join("./src", "views"));
  app.set("view engine", "jade");


  // config static files path (for CSS, JS, Images)
  // console.log("====> check drirname file public", path.join("./src", "public"));
  app.use(express.static(path.join("./src", "public")));
};

module.exports = configViewEngine;
