
const Category = require("./categoryRoutes");
const Product = require("./productRoutes");
const User = require("./userRoutes");
const Auth = require("./authRoutes");
const initRoute = (app) => {
  app.use("/v1/api", Category);
  app.use("/v1/api", Product);
  app.use("/v1/api", User);
  app.use("/v1/api", Auth);
};

module.exports = initRoute;
