//사용자 정보처리를 위한 RESTful 데이터 전용 요청과 응답처리 전용 라웉 ㅓ파일
var express = require("express");
var router = express.Router();

var db = require("../models/index");

router.post("/login", async (req, res, next) => {
  var apiResult = {
    code: 200,
    data: null,
    result: "",
  };

  try {
    var email = req.body.email;
    var password = req.body.password;

    var member = await db.Member.findOne({ where: { email } });
    console.log("email : ", email);
    console.log("password : ", password);

    var resultMsg = "";
    if (member == null) {
      console.log("아이디가 없는 경우 : ", resultMsg);
      resultMsg = "동일한 메일주소가 존재하지 않습니다.";
      apiResult.code = 400;
      apiResult.data = null;
      apiResult.result = resultMsg;
    } else {
      if (member.password === password) {
        console.log("로그인 성공시 : ", resultMsg);
        resultMsg = "로그인 성공";
        apiResult.code = 200;
        apiResult.data = member;
        apiResult.result = resultMsg;
      } else {
        resultMsg = "비번틀림";

        apiResult.code = 400;
        apiResult.data = null;
        apiResult.result = resultMsg;
      }
    }
  } catch (err) {
    resultMsg = "서버에러";
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = resultMsg;
  }

  res.json(apiResult);
});

module.exports = router;
