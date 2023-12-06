var express = require("express");
var router = express.Router();

/* GET home page. */
/* 메인페이지 요청 및 응답처리 라우팅 메소드*/
//이거는 express_테스트 이런 식으로 바꾸고 나서 적용하려면
//npm을 한번 종료해서 서버내리고 다시 올려야함.
//public에 있던 것들은 서버 안내리고 바뀌어도 된던데.
//이걸 편하게 하기 위한게 nodemon
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express_테스트3" }); //
});

module.exports = router;
