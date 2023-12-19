var express = require("express");
var router = express.Router();

/* GET home page. */

const messages = [
  {
    channel_id: 1,
    member_id: 1,
    nick_name: "hwoarang09",
    msg_type_code: 111,
    connection_id: "접속아디1",
    message: "메세지1",
    ip_address: "111.111.123.44",
    top_channel_msg_id: 1,
    msg_state_code: 1,
    msg_date: Date.now(),
    edit_date: Date.now(),
    del_date: Date.now(),
  },
  {
    channel_id: 1,
    member_id: 2,
    nick_name: "ysw",
    msg_type_code: 222,
    connection_id: "접속아디2",
    message: "메세지2",
    ip_address: "111.222.222.44",
    top_channel_msg_id: 2,
    msg_state_code: 0,
    msg_date: Date.now(),
    edit_date: Date.now(),
    del_date: Date.now(),
  },
  {
    channel_id: 2,
    member_id: 1,
    nick_name: "hwoarang09",
    msg_type_code: 333,
    connection_id: "접속아디3",
    message: "메세지3",
    ip_address: "111.333.123.44",
    top_channel_msg_id: 1,
    msg_state_code: 1,
    msg_date: Date.now(),
    edit_date: Date.now(),
    del_date: Date.now(),
  },
];

router.get("/list", async (req, res, next) => {
  var searchOption = {
    nick_name: "닉네임",
    email: "이메일@이메일",
    channel_id: "채널id",
  };
  res.render("message/list", { messages, searchOption });
});

router.get("/create", async (req, res, next) => {
  res.render("message/create", { title: "message/create" });
});

router.post("/create", async (req, res, next) => {
  res.redirect("/message/list");
});

router.get("/modify", async (req, res, next) => {
  res.render("message/modify", { title: "message/modify" });
});

router.post("/modify", async (req, res, next) => {
  res.redirect("/message/list");
});

router.get("/delete", async (req, res, next) => {
  res.redirect("/message/list");
});

module.exports = router;
