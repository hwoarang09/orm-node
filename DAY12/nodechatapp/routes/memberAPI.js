var express = require("express");
var router = express.Router();

/* GET home page. */
var member_list = [
  {
    member_id: 1,
    email: "hwoarang09@naver.com",
    member_password: "맴버1비번",
    name: "윤성원",
    profile_img_path: "멤버1이미지주소",
    telephone: "01022883839",
    entry_type_code: 1,
    use_state_code: 1,
    birth_date: "900311",
    reg_date: Date.now(),
    reg_member_id: 881,
    edit_date: Date.now(),
    edit_member_id: 991,
  },
  {
    member_id: 2,
    email: "rang0909@naver.com",
    member_password: "맴버2비번",
    name: "윤성일",
    profile_img_path: "멤버2이미지주소",
    telephone: "01122883839",
    entry_type_code: 1,
    use_state_code: 1,
    birth_date: "910312",
    reg_date: Date.now(),
    reg_member_id: 882,
    edit_date: Date.now(),
    edit_member_id: 992,
  },
  {
    member_id: 3,
    email: "a01022883839@gmail.ocm",
    member_password: "맴버3비번",
    name: "윤성삼",
    profile_img_path: "멤버3이미지주소",
    telephone: "01222883839",
    entry_type_code: 0,
    use_state_code: 0,
    birth_date: "900313",
    reg_date: Date.now(),
    reg_member_id: 883,
    edit_date: Date.now(),
    edit_member_id: 993,
  },
];

router.get("/all", async (req, res, next) => {
  res.render("member/list", { member_list });
});

router.post("/create", async (req, res, next) => {
  var member_id = req.body.member_id;
  var email = req.body.email;
  var member_password = req.body.member_password;
  var name = req.body.name;
  var profile_img_path = req.body.profile_img_path;
  var telephone = req.body.telephone;
  var entry_type_code = req.body.entry_type_code;
  var use_state_code = req.body.use_state_code;
  var birth_date = req.body.birth_date;
  var reg_member_id = req.body.reg_member_id;
  var edit_member_id = req.body.edit_member_id;

  var member = {
    member_id,
    email,
    member_password,
    name,
    profile_img_path,
    telephone,
    entry_type_code,
    use_state_code,
    birth_date,
    reg_date: Date.now(),
    reg_member_id,
    edit_date: Date.now(),
    edit_member_id,
  };

  console.log("member : ", member);
  res.send(member);
});

router.post("/modify", async (req, res, next) => {
  var member_id = req.body.member_id;
  var email = req.body.email;
  var member_password = req.body.member_password;
  var name = req.body.name;
  var profile_img_path = req.body.profile_img_path;
  var telephone = req.body.telephone;
  var entry_type_code = req.body.entry_type_code;
  var use_state_code = req.body.use_state_code;
  var birth_date = req.body.birth_date;
  var reg_member_id = req.body.reg_member_id;
  var edit_member_id = req.body.edit_member_id;

  var member = {
    member_id,
    email,
    member_password,
    name,
    profile_img_path,
    telephone,
    entry_type_code,
    use_state_code,
    birth_date,
    reg_date: Date.now(),
    reg_member_id,
    edit_date: Date.now(),
    edit_member_id,
  };

  console.log("member modify: ", member);

  res.send(member);
});

router.post("/delete", async (req, res, next) => {
  var member_id = req.body.member_id;
  console.log("member_id in delte ", member_id);
  res.send({ member_id });
});

router.get("/:mid", async (req, res, next) => {
  var mid = req.params.mid;
  console.log("mid : " + mid);
  var member = member_list.filter((member) => {
    console.log("member_id : " + member.member_id);
    if (member.member_id === Number(mid)) return member;
  });
  console.log("member :" + JSON.stringify(member, null, 2));
  //res.render("member/list", { member_list });
  res.send(member);
});

module.exports = router;
