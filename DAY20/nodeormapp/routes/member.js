//사용자 정보처리를 위한 웹페이지 요청과 응답처리 전용 라우터 파일

var express = require("express");
var router = express.Router();

var db = require("../models/index");

router.get("/entry", async (req, res, next) => {
  res.render("member/entry");
});
router.post("/entry", async (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  var member = {
    email,
    password,
  };
  console.log("email : ", email);
  console.log("password : ", password);

  //이제 db에 넣는거임. 이거 배운거야 한 4,5일동안 배운거.
  //db.Member.create는 orm프레임워크에 의해서 백엔드에서 기본적으로 있나봐.
  //INSERT INTO members(email, password,createdAT)Values('이메일', '암호');
  //이런 쿼리가 만들어져서 db서버로 전달되어 데이터가 입력되는 식인듯..?
  var savedMember = await db.Member.create(member);
  res.redirect("/");
});

router.get("/login", async (req, res, next) => {
  res.render("member/login", { resultMsg: "", email: "", password: "" });
});
router.post("/login", async (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  var member = await db.Member.findOne({ where: { email } });
  console.log("email : ", email);
  console.log("password : ", password);

  var resultMsg = "";
  if (member == null) {
    resultMsg = "동일한 메일주소가 존재하지 않습니다.";
    console.log("member가 null");
  } else {
    if (member.password === password) {
      console.log("resultMsg : ", resultMsg);
      res.redirect("/");
    } else {
      resultMsg = "비번틀림";
      console.log("비번ㄴ틀림", member.password, password);
    }
  }
  if (resultMsg !== "") {
    res.render("member/login", { resultMsg, email, password });
  }
});

module.exports = router;
