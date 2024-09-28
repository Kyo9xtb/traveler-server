const mySqlDB = require("../config/dbConfig");

const getHomePage = (req, res) => {
  res.render("index", { title: "Traveler Server" });
};
 module.exports = {getHomePage};