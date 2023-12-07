/*
-기능 : 각종 회원정보 요청과 응답처리 라우팅
*/

var express = require("express");
var router = express.Router();

//중요 : 사용자가 요청하는 방식(get, post, delete 등등)과 주소가 동일한 라우팅 메소드를 찾습니다.
/*
-기능: 사용자 가입 약관 웹페이지에 대한 요청과 응답처리 라우팅 메소드
-요청방식:get
-요청주소:http://localhost:3000/memgber/join
-응답결과: 회원약관 웹페이지 전달(join.ejs)
*/
router.get("/join", function (req, res) {
  res.render("member/join.ejs", { message: "hihihi" });
});
router.get("/entry", function (req, res) {
  res.render("member/entry.ejs", { message: "hihihi" });
});

router.post("/entry", function (req, res) {
  //step1 : 회원가입정보 추출
  var email = req.body.email;
  var password = req.body.password;
  var name = req.body.name;
  var phone = req.body.phone;

  console.log(req.body);
  console.log(
    `entry!!!!email ${email}  password ${password} name ${name} phone : ${phone}`
  );

  //step2: db에 해당 정보가 잇는지 확인 (중복여부)

  //step3: 메일주소가 중복아니면 신규회원으로 db에 등록
  var member = {
    email,
    password,
    name,
    phone,
    entryDate: Date.now(),
  };
  if (email !== "" && password !== "") res.redirect("/auth/login");
});

module.exports = router;
