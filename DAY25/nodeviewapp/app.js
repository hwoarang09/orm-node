var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

//레이아웃 참조
var expressLayouts = require("express-ejs-layouts");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var articleRouter = require("./routes/article");
var articleAPIRouter = require("./routes/articleAPI");
const connect = require("./schemas/index");

connect();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//레이아웃 설정
app.set("layout", "layout");
app.set("layout extractScripts", true); //컨텐츠 페이지 내 script 태그를 레이아웃에 통합할 지 여부
app.set("layout extractStyles", true); //style
app.set("layout extractMetas", true); //meta -> 난 메타는 연습 안따라감;;나중에 다시 설명해주신다 다 함.
app.use(expressLayouts);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/article", articleRouter);
app.use("/api/article", articleAPIRouter);
app.use(connect);
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
