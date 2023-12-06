//auth.js 라우터 파일은 회원 인증과 관련된 모든 사용자 요청과 응답을 처리합니다.
//모든 라우터 파일은 기본 라우팅 주소체계를 가집니다.
//http://localhost:3000/라우터파일의 기본주소/라우팅메소드의 주소
//우리는 auth.js니가
//http://localhost:3000/auth/~ 이런 식으로 되게 할거임. auth.js니까 무조건 이렇게 되는건 아닌가봄.
//우리가 따로 설정해야되나봐.
///authentication/~으로 가게 설정할수도 잇는데 좀잇다 설명한다하심

var express = require("express");
var router = express.Router();

router.get("/login", function (req, res) {
  res.render("auth/login.ejs", { message: "hihihi" });
});

//호출방식 : post
router.post("/login", function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  console.log(req.body);
  console.log(`email ${email}  password ${password}`);

  //step2 : 모델을 이용해 동일한 메일주소와 암호가 있는지 체크한다.

  //step3: 정상적인 사용자 메일/암호인 경우 메인페이지로 사용자 웹페이지를 이동시켜준다.
  //res httpResponse객체의 redirect('주소')메소드는 지정된 url주소체계로 사용자 웹펭지를 이동시켜준다.
  //리다이랙트는 ejs파일을 뷰 시키는 게 아니라 주소체계를 받아서 거기로 넘기는거.
  if (email !== "" && password !== "") res.redirect("http://www.naver.com");
  //else res.send("POST 요청이 성공적으로 처리되었습니다.");
});

//로그아웃처리
router.get("/logout", function (req, res) {
  //step1 : 로그아웃처리
  //step2 : 로그아웃 후 이동할 페잊 ㅣ지정
  res.redirect("/main");
});
module.exports = router;
