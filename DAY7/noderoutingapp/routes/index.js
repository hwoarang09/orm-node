//express 웹개발 프레임워크 패키지 참조
var express = require("express");

//express객체의 Router()메소드를 호출해서 router 객체를 생성
//router 객체는 모든 사용자의 요청과 응답을 처리하는 핵심개체
var router = express.Router();

/* GET home page. */
router.get("/main", function (req, res, next) {
  res.render("main", { title: "Express" });
});
//router('주소체계', 호출된 주소에서 처리할 콜백함수);
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//회사소개 라우터
router.get("/company", function (req, res) {
  //req : httpRequest객체임. 웹브라우저 또는 클라이언트에서 넘어오는 각종 요청정보
  //res : httpResponse객체로 웹서버에서 웹르아줘로 응답을 처리해주는 객체
  //주로 res를 이용해 서버상의 웹페이지, 데이터 등을 전달
  //res.render('views폴더내의 특정뷰파일 지정, 뷰에 전달할 데이터)
  res.render("company.ejs", { companyName: "네이버", ceo: "강창훈" });
});

//회사 연락초 정로 제공 라우터
//요청하는 방식이 get, post, put, delete 등등 6가지정도 있음.
//그거에 맞게 router.메소드 써야함.
router.get("/contact", function (req, res) {
  res.render("sample/contact", {
    email: "a01022883839@gamil.com",
    phone: "01022883839",
    address: "영등포구 유탑유블레스",
  });
});

//회사 제품소개 라우터
router.get("/products/computer", function (req, res) {
  const computer = {
    price: "1000원",
    qual: "최상급",
    image_address: "",
  };
  res.render("product/computar.ejs", computer);
});

//회사 대표 인삿말 웹페이지 요청과 응답처리 라우팅 메소드
router.get("/welcome", function (req, res) {
  res.render("welcome.ejs");
});

module.exports = router;
