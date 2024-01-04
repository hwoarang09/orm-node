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
    top_channel_msg_id: 1111,
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
    top_channel_msg_id: 2222,
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
    top_channel_msg_id: 3333,
    msg_state_code: 1,
    msg_date: Date.now(),
    edit_date: Date.now(),
    del_date: Date.now(),
  },
];

router.get("/list", async (req, res, next) => {
  var searchOption = {
    nick_name: "닉네임",
    email: "email@email.com",
    channel_id: "채널id",
  };
  res.render("message/list", { messages, searchOption });
});

router.post("/list", async (req, res, next) => {
  var searchOption = {
    nick_name: req.body.nick_name,
    email: req.body.email,
    channel_id: req.body.channel_id,
  };

  var ret = messages.filter((message) => {
    if (searchOption.nick_name === message.nick_name) return message;
  });
  res.render("message/list", { messages: ret, searchOption });
});

router.get("/create", async (req, res, next) => {
  res.render("message/create", { title: "message/create" });
});

router.post("/create", async (req, res, next) => {
  res.redirect("/message/list");
});

router.get("/modify/:top_channel_msg_id", async (req, res, next) => {
  //선택한 게시글 고유번호를 파라메터 방식으로 URL을 통해 전달받음.
  var top_channel_msg_id = req.params.top_channel_msg_id;
  console.log("test modify get, top_channel_msg_id : ", top_channel_msg_id);

  if (top_channel_msg_id === undefined) res.send("error");
  else {
    var message = messages.filter((message) => {
      if (message.top_channel_msg_id === Number(top_channel_msg_id))
        return message;
    })[0];

    console.log("modify message : ", JSON.stringify(message, null, 2));

    res.render("message/modify", { message });
  }
});
router.post("/modify/:top_channel_msg_id", function (req, res, next) {
  var top_channel_msg_id = req.params.top_channel_msg_id;

  var message = messages.filter((message) => {
    if (message.top_channel_msg_id === Number(top_channel_msg_id))
      return message;
  })[0];
  console.log("modify post article : ", JSON.stringify(message, null, 2));
  res.redirect("/message/list");
});

router.get("/delete", async (req, res, next) => {
  res.redirect("/message/list");
});

module.exports = router;
