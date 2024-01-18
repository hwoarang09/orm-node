var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/*
전체채팅
http://localhost:3000/chat
*/
router.get("/chat", function (req, res, next) {
  res.render("chat");
});

/*
특정 채팅방(채널) 사용자간 채팅하기 웹페이지 요청과 응답
http://localhost:3000/groupchat
*/
router.get("/groupchat", function (req, res, next) {
  res.render("groupchat");
});
module.exports = router;
