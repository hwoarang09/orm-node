var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const layout = require("express-ejs-layouts");
require("dotenv").config();

//cors
const cors = require("cors");

var sequelize = require("./models/index.js").sequelize;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var channelRouter = require("./routes/channel");
var channelAPIRouter = require("./routes/channelAPI");
var memberAPIRouter = require("./routes/memberAPI");

var app = express();

sequelize.sync();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layout/authLayout");
// app.set("layout extractScripts", true);
// app.set("layout extractStyles", true);
// app.set("layout extractMetas", true);

app.use(layout);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({}));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/chat", channelRouter);
app.use("/api/channel", channelAPIRouter);
app.use("/api/member", memberAPIRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
