var express = require("express");
var router = express.Router();
const path = require("path");
const app = express();

//각종 라이브러리
const ChannelMember = require("../schemas/member");

//개인용 util
const { mergeByKey } = require("./utils/utiles");

//login api
router.post("/login", async (req, res, next) => {
  try {
    var { email, password } = req.body;

    const member = await ChannelMember.findOne({ email });
    if (!member) {
      return res.json({ success: false, message: "No member" });
    } else if (member.member_password !== password) {
      return res.json({ success: false, message: "Password Wrong" });
    } else {
      return res.json({ success: true, message: "Login success" });
    }
  } catch (err) {
    console.error("Error in member get:", err);
    res.status(500).send("Internal Server Error");
  }
});

//entry api

router.post("/entry", async (req, res, next) => {
  try {
    var new_member = {
      email: req.body.email,
      member_password: req.body.member_password,
      name: req.body.name,
      profile_img_path: req.body.profile_img_path,
      telephone: req.body.telephone,
      entry_type_code: req.body.entry_type_code,
      use_state_code: req.body.use_state_code,
      birth_date: req.body.birth_date,
      reg_date: Date.now(),
      reg_member_id: req.body.reg_member_id,
      edit_date: Date.now(),
      edit_member_id: req.body.edit_member_id,
    };

    const member = await ChannelMember.findOne({ email: new_member.email });
    if (member) {
      return res.json({ success: false, message: "Already Member exists" });
    } else {
      var result = await ChannelMember.create(new_member);
      console.log("create result : ", result);
      return res.json({ success: true, message: "Create Success" });
    }
  } catch (err) {
    console.error("Error in member entry:", err);
    res.status(500).send("Internal Server Error");
  }
});

//find api
router.post("/find", async (req, res, next) => {
  try {
    var { email } = req.body;

    const member = await ChannelMember.findOne({ email });
    if (!member) {
      return res.json({ success: false, message: "No member ...to find" });
    } else {
      return res.json({
        success: true,
        message: `${member.email}'s password is ${member.member_password}`,
      });
    }
  } catch (err) {
    console.error("Error in member get:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/all", async (req, res, next) => {
  const member_list = await ChannelMember.find({});
  res.send(member_list);
});

router.post("/create", async (req, res, next) => {
  try {
    var member = {
      email: req.body.email,
      member_password: req.body.member_password,
      name: req.body.name,
      profile_img_path: req.body.profile_img_path,
      telephone: req.body.telephone,
      entry_type_code: req.body.entry_type_code,
      use_state_code: req.body.use_state_code,
      birth_date: req.body.birth_date,
      reg_date: Date.now(),
      reg_member_id: req.body.reg_member_id,
      edit_date: Date.now(),
      edit_member_id: req.body.edit_member_id,
    };
    await ChannelMember.create(member);
    console.log("member create : ", member);
    res.send(member);
  } catch (err) {
    console.error("Error in member create:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/modify", async (req, res, next) => {
  var member_id = req.body.member_id;
  try {
    const member = await ChannelMember.findOne({ member_id });
    var mergedObject = mergeByKey(member.toJSON(), req.body);
    mergedObject.edit_date = Date.now();
    mergedObject.reg_date = Date.now();
    await ChannelMember.updateOne({ member_id }, mergedObject);
    res.send(member);
  } catch (err) {
    res.status(400).send("error!!! : " + err);
  }
});

router.post("/delete", async (req, res, next) => {
  try {
    var member_id = req.body.member_id;
    console.log("delete member_id : ", member_id);
    var member = await ChannelMember.deleteOne({ member_id });
    //console.log("member delete :", member);
    if (!member || member.deletedCount === 0) {
      return res.status(404).send("Member not found");
    }
    //res.send(member);
    console.log("member_id in delte ", member_id, member);
    res.send({ member_id });
  } catch (err) {
    console.error("Error in member get:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:mid", async (req, res, next) => {
  try {
    var member_id = req.params.mid;
    const member = await ChannelMember.findOne({ member_id });

    if (!member) {
      // 멤버를 찾지 못한 경우
      return res.status(404).send("Member not found");
    }

    // 멤버를 찾은 경우
    //res.render("member/list", { member_list });
    res.send(member);
  } catch (err) {
    console.error("Error in member get:", err);
    res.status(500).send("Internal Server Error");
  }
});

//아래의 에러처리 코드는 무조건 router정의가 다 끝난 최하단에 위치해야 함.
//위에서 정의하지 않은 라우터에 대한 모든 요청에 대해서
//Error 객체를 생성하는 아래의 미들웨어를 실행한다.
router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

//위에서 받은 Error객체를 통해 화면에 처리하는 미들웨어
router.use((err, req, res, next) => {
  //console.log(err);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

module.exports = router;
