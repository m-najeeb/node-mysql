const userRoutes = require("./routers/userRoutes");

function setup(app) {
  app.use("/api/users", userRoutes);
}

module.exports = setup;
