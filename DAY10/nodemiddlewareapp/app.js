//각종 노트 패키지를 참조합니다.
var createError = require("http-errors");

//node express 웹 개발 프레임워크를 참조합니다.
var express = require("express");

//path라는 노드프레임워크의 파일/폴더 경로정보를 추출하는 패키지를 참조합니다.
var path = require("path");

//웹 서버에서 발급해주는 쿠키파일에 대한 정보를 추출하는 cookie-parser 패키지를 참조합니다.
var cookieParser = require("cookie-parser");

//morgan이라는 노드패키지를 통해 사용자 이벤트(요청과 응탑)
var logger = require("morgan");

//라우팅 경로 사용.
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

//express 객체를 이용해 노트엡 객체를 생성함.
//app은 backend node application 그 자체임.
var app = express();

//개발자 정의 미들웨어 함수 기능 구현
app.use(function (req, res, next) {
  console.log("미들웨어함수 호출1: ", Date.now());

  //이게 있어야 다음으로 넘어감.
  //미들웨어에서 다음 미들웨어로 넘길때 필요한거임.
  next();
});
// view engine setup
// view 폴더의 위치 설정
app.set("views", path.join(__dirname, "views"));

//mvc에서 사용하는 viewengine 기술로 ejs사용하기로 설정
app.set("view engine", "ejs");

//app.use()가 미들웨어임.
//사용자들이 매번 어떠한 요청과 응답을 해오더라도
//매번 요청이 발생할때마다 실행되는 어플리케이션 미슬웨어 함수 기능 정의
//하기 모든 app.use메소드들은 특정 사용자의 요청과 응답이 발생할 때 마다 실해오디는 기능
app.use(logger("dev"));

//json기능 탑재
app.use(express.json());

//
app.use(express.urlencoded({ extended: false }));

//
app.use(cookieParser());

//
app.use(express.static(path.join(__dirname, "public")));

//사용자 정의 라우팅 미들웨어2
// /user/id
app.use("/user/:id", function (req, res, next) {
  const uid = req.params.id;
  console.log("사용자정의 미들웨어 호출2: ", req.method);
  res.send("사용자 아이디 " + uid);
  next();
  //여기서는 밑으로 흘러갈 필요가 없으니 next()필요없음
});

// app.use(function (req, res, next) {
//   console.log("hi");
// });
app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
//사용자 요청에 대해 요청을 못찾거나 리소스를 못찾으면 404에러를 웹브라우저에 ㄷ전달해줌.
//http-errors라는 패키지를 createError로 불러왔음.
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// mvc 패턴 노드백엔드 환경에서ㄴ의 서버에러 발생시 처리해주는 전역예외처리기 기능제공
// 404는 없는 걸 내놓으라고 했을때 나는거고
// 500은 개발자가 코딩을 잘못해서 서버에 에러가 나는 경우..여기로 감.
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
