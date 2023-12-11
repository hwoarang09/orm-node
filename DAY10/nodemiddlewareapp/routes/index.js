var express = require("express");
var router = express.Router();

//미들웨어 참조
const { checkParams, checkQueryKey } = require("./middleware.js");

console.log("index.js를 use하니까 이게 바로 실행되나?");
//라우터 미들웨어 함수 샘플3
//index.js 라우터가 실행될 때 마다 실해오디는 미들웨어 함수
router.use(function (req, res, next) {
  console.log("index.js 사용자 정의 미들웨어 함수 샘플1 : ");
  next();
});

router.use("/sample/:id", function (req, res, next) {
  console.log("index 라우터 미들웨어 함수2 request.URL =", req.originalUrl);
  res.send(req.method);
  //next();
});
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//원래 실행되어야 할 함수 전에 미들웨어가 실행됨.
router.get("/te/:id", checkParams, function (req, res) {
  //res.send(req.params.id);
  res.render("index", { title: "te/id" });
});

//이거는 Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
//이런 에러뜸. 미들웨어에서 next하고 또 send해서 그런가?
router.get("/test/eddy/:id/:category", (req, res, next) => {
  checkParams(req, res, next);
  checkQueryKey(req, res, next);
  res.send(req.params.id + " " + req.params.category);
});
module.exports = router;
