const express = require("express");
const router = express.Router();

var db = require("../models/index");
const Channel = require("../models/channel");
var Op = db.Sequelize.Op;
const { tokenAuthChecking } = require("./apiMiddleware");
//각종 라이브러리
const channelList = [
  {
    channel_id: "0",
    category_code: "01",
    channel_name: "두부 조아",
    channel_desc: "두부를 좋아하는 사람들의 모임",
    user_limit: "130",
    channel_img_path: null,
    channel_state_code: "Y",
    reg_date: new Date(),
    reg_member_id: "myjeong19",
    edit_date: new Date(),
    edit_member_id: "myjeong19",
  },
  {
    channel_id: "1",
    category_code: "02",
    channel_name: "시공 조아",
    channel_desc: "시공을 좋아하는 사람들의 모임",
    user_limit: "150",
    channel_img_path: null,
    channel_state_code: "Y",
    reg_date: new Date(),
    reg_member_id: "myjeong19",
    edit_date: new Date(),
    edit_member_id: "myjeong19",
  },
  {
    channel_id: "2",
    category_code: "01",
    channel_name: "물 조아",
    channel_desc: "물을 좋아하는 사람들의 모임",
    user_limit: "130",
    channel_img_path: null,
    channel_state_code: "Y",
    reg_date: new Date(),
    reg_member_id: "myjeong19",
    edit_date: new Date(),
    edit_member_id: "myjeong19",
  },
];

var apiResult = {
  code: 200,
  data: null,
  result: "",
};

router.get("/all", async (req, res, next) => {
  try {
    const channelList = await Channel.find({});

    apiResult.code = 200;
    apiResult.data = channelList;
    apiResult.result = "OK";
  } catch (error) {
    console.log("ERROR: 에러가 발생했습니다 관리자에게 문의하세요.");
  }

  res.json(apiResult);
});

router.post("/create", async (req, res, next) => {
  console.log("body :", req.body);
  try {
    const {
      community_id,
      category_code,
      channel_name,
      user_limit,
      channel_img_path,
      channel_desc,
      channel_state_code,
      reg_date,
      reg_member_id,
      edit_date,
      edit_member_id,
    } = req.body;

    const channel = {
      community_id,
      category_code,
      channel_name,
      channel_desc,
      user_limit,
      channel_img_path,
      channel_state_code,
      reg_member_id,
      reg_date: new Date(),
      edit_member_id,
      edit_date: new Date(),
    };

    console.log("channel : ", channel);
    const newChannel = await db.Channel.create(channel);

    apiResult.code = 200;
    apiResult.data = newChannel;
    apiResult.result = "OK";
  } catch (error) {
    console.log(error.message);

    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = "Failed";
  }

  res.json(apiResult);
});

router.get("/modify/:id", async (req, res, next) => {
  try {
    const findId = req.params.id;

    res.json(channelList[findId]);
  } catch (error) {
    console.log("ERROR: 에러가 발생했습니다 관리자에게 문의하세요.");
  }
});

router.post("/modify/:id", async (req, res, next) => {
  try {
    const getChannel = channelList.find(
      (channel) => channel.channel_id !== req.body.channel_id
    );

    res.json(getChannel);
  } catch (error) {
    console.log("ERROR: 에러가 발생했습니다 관리자에게 문의하세요.");
  }
});

router.post("/delete", async (req, res, next) => {
  try {
    var channel_id = req.body.channel_id;

    const deletedChannel = await Channel.deleteOne({ channel_id });

    apiResult.code = 200;
    apiResult.data = deletedChannel;
    apiResult.result = "OK";
  } catch (error) {
    console.log(error.message);

    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = "Failed";
  }

  res.json(apiResult);
});

router.get("/modify/:id", async (req, res, next) => {
  try {
    const channelId = req.params.id;

    const savedChannel = await Channel.findOne({ channel_id: channelId });

    apiResult.code = 200;
    apiResult.data = savedChannel;
    apiResult.result = "OK";
  } catch (error) {
    console.log("ERROR: 에러가 발생했습니다 관리자에게 문의하세요.");

    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = "Failed";
  }

  res.json(apiResult);
});

router.post("/modify/:id", async (req, res, next) => {
  try {
    var channelId = req.params.id;

    var {
      community_id,
      category_code,
      channel_name,
      user_limit,
      channel_img_path,
      channel_desc,
      channel_state_code,
      reg_date,
      reg_member_id,
      edit_date,
      edit_member_id,
    } = req.body;

    var channel = {
      community_id,
      category_code,
      channel_name,
      channel_desc,
      user_limit,
      channel_img_path,
      channel_state_code,
      reg_member_id,
      reg_date: new Date(),
      edit_member_id,
      edit_date: new Date(),
    };

    const updatedChannel = await Channel.updateOne(
      { channel_id: channelId },
      channel
    );

    apiResult.code = 200;
    apiResult.data = updatedChannel;
    apiResult.result = "OK";
  } catch (error) {
    console.log(error.message);

    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = "Failed";
  }

  res.json(apiResult);
});

module.exports = router;
