const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const globalError = require("./middleware/globalError");

//============== MiddleWares ====================
const app = express();
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public/assets")));

//==================== Routes =====================
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

//============== Routes errors handling ==============
app.all("*", (req, res, next) => {
  console.log("====== route error =======");
  res
    .status(404)
    .json({ message: `can't find this route: ${req.originalUrl}` });
});
app.use(globalError);
//============== Global errors handling ==============

module.exports = app;
