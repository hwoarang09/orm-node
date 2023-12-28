var express = require("express");
var router = express.Router();

/* GET home page. */
var channel_list = [
  {
    channel_id: 110011,
    community_id: 1,
    category_code: 1021,
    channel_name: "채널1",
    user_limit: 100,
    channel_img_path: "채널1이미지",
    channel_desc: "채널1설명",
    channel_state_code: 1,
    reg_date: Date.now(),
    reg_member_id: 881,
    edit_date: Date.now(),
    edit_member_id: 991,
  },
  {
    channel_id: 220022,
    community_id: 2,
    category_code: 1022,
    channel_name: "채널2",
    user_limit: 200,
    channel_img_path: "채널2이미지",
    channel_desc: "채널2설명",
    channel_state_code: 0,
    reg_date: Date.now(),
    reg_member_id: 882,
    edit_date: Date.now(),
    edit_member_id: 992,
  },
  {
    channel_id: 330033,
    community_id: 3,
    category_code: 1023,
    channel_name: "채널3",
    user_limit: 300,
    channel_img_path: "채널3이미지",
    channel_desc: "채널3설명",
    channel_state_code: 1,
    reg_date: Date.now(),
    reg_member_id: 883,
    edit_date: Date.now(),
    edit_member_id: 993,
  },
];

router.get("/list", async (req, res, next) => {
  var searchOption = {
    channel_name: "채널이름",
    channel_desc: "채널 설명",
    channel_state_code: "채널상태",
  };
  res.render("channel/list", { channel_list, searchOption });
});

router.get("/create", async (req, res, next) => {
  res.render("channel/create", { title: "channel/create" });
});

router.post("/create", async (req, res, next) => {
  var community_id = req.body.community_id;
  var category_code = req.body.category_code;
  var channel_name = req.body.channel_name;
  var user_limit = req.body.user_limit;
  var channel_img_path = req.body.channel_img_path;
  var channel_desc = req.body.channel_desc;
  var channel_state_code = req.body.channel_state_code;
  var reg_member_id = req.body.reg_member_id;
  var edit_member_id = req.body.edit_member_id;

  var channel = {
    community_id,
    category_code,
    channel_name,
    user_limit,
    channel_img_path,
    channel_desc,
    channel_state_code,
    reg_date: Date.now(),
    reg_member_id,
    edit_date: Date.now(),
    edit_member_id,
  };

  console.log("channel : ", channel);
  res.redirect("/channel");
});

router.get("/modify/:channel_id", async (req, res, next) => {
  var channel_id = req.params.channel_id;

  var channel = {
    channel_id,
    community_id: "커뮤니티 id",
    category_code: "카테고리",
    channel_name: "채널이름",
    user_limit: "채널제한",
    channel_img_path: "채널이미지주소",
    channel_desc: "채널설명",
    channel_state_code: 1,
    reg_date: Date.now(),
    reg_member_id: 880,
    edit_date: Date.now(),
    edit_member_id: 990,
  };

  res.render("channel/modify", { channel });
});

router.post("/modify/:channel_id", async (req, res, next) => {
  var channel_id = req.params.channel_id;
  var community_id = req.body.community_id;
  var category_code = req.body.category_code;
  var channel_name = req.body.channel_name;
  var user_limit = req.body.user_limit;
  var channel_img_path = req.body.channel_img_path;
  var channel_desc = req.body.channel_desc;
  var channel_state_code = req.body.channel_state_code;
  var reg_member_id = req.body.reg_member_id;
  var edit_member_id = req.body.edit_member_id;

  var channel = {
    channel_id,
    community_id,
    category_code,
    channel_name,
    user_limit,
    channel_img_path,
    channel_desc,
    channel_state_code,
    reg_date: Date.now(),
    reg_member_id,
    edit_date: Date.now(),
    edit_member_id,
  };

  console.log("channel modify: ", channel);

  res.redirect("/channel");
});

router.get("/delete", async (req, res, next) => {
  var channel_id = req.query.channel_id;
  console.log("channel_id in delte ", channel_id);
  res.redirect("/channel");
});

module.exports = router;
