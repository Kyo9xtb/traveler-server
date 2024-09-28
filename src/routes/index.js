const webRoute = require("./web");
function route(app) {
  // app.use("/", function (req, res, next) {
  //   res.render("index", { title: "Database Ecommerce" });
  // });
  app.use("/", webRoute);
}
module.exports = route;
