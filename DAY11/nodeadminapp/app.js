var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var adminRouter = require("./routes/admin");
var articleRouter = require("./routes/article");
var memberRouter = require("./routes/member");
var channelRouter = require("./routes/channel");
var messageRouter = require("./routes/message");
var testRouter = require("./routes/test");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//test라는 라우터는 맨 위에 넣을 경우
//http://127.0.0.1:3001/test를 접속하면
//test.js에서 구현한 페이지가 화면에 뜸
//app.use("/test", testRouter);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/admin", adminRouter);
app.use("/article", articleRouter);
app.use("/member", memberRouter);
app.use("/channel", channelRouter);
app.use("/message", messageRouter);

//test라는 라우터는 맨 아래에 넣을 경우
//http://127.0.0.1:3001/test를 접속하면
//index.js에서 구현한 /test 페이지가 화면에 뜸
//app.use("/test", testRouter);

//즉 먼저 선언한 라우팅 체계를 따라간다고 볼 수 있다.

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
