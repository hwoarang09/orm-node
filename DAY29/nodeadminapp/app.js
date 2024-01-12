var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
//환경설정팡리 호출하기: 전역정보로 설정됨
require("dotenv").config();

var sequelize = require("./models/index").sequelize;

//레이아웃 참조
var expressLayouts = require("express-ejs-layouts");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const adminRouter = require("./routes/admin");
const channelRouter = require("./routes/channel");
const memberRouter = require("./routes/member");
const messageRouter = require("./routes/message");
const articleRouter = require("./routes/article");
const articleAPIRouter = require("./routes/articleAPI");

//var articleAPIRouter = require("./routes/articleAPI");

var sequelize = require("./models/index.js").sequelize;

var app = express();

//mysql과 자동연결처리 및 모델기반 물리 테이블 생성처리제공
sequelize.sync();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//레이아웃 설정
app.set("layout", "layout");
app.set("layout extractScripts", true); //컨텐츠 페이지 내 script 태그를 레이아웃에 통합할 지 여부
app.set("layout extractStyles", true); //style
app.set("layout extractMetas", true); //meta -> 난 메타는 연습 안따라감;;나중에 다시 설명해주신다 다 함.

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "testsecret",
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 5, //5분동안 서버세션을 유지하겠다.(1000은 1초)
    },
  })
);
app.use(expressLayouts);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/admin", adminRouter);
app.use("/article", articleRouter);
app.use("/api/articles", articleAPIRouter);
app.use("/channel", channelRouter);
app.use("/member", memberRouter);
app.use("/message", messageRouter);

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
