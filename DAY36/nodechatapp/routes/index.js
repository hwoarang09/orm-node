const express = require("express");
const router = express.Router();
var db = require("../models/index");
var Op = db.Sequelize.Op;
const bcrypt = require("bcryptjs");
const aes = require("mysql-aes");
const jwt = require("jsonwebtoken");
const { json } = require("sequelize");
const member = require("../models/member");

/* GET home page. */

router.get("/", async (req, res, next) => {
  res.render("login");
});

router.post("/", async (req, res) => {
  try {
    var { email, member_password } = req.body;
    console.log(email, member_password);
    email = aes.encrypt(email, process.env.MYSQL_AES_KEY);

    const getMember = await db.Member.findOne({ where: { email } });
    //console.log("getMember :", getMember);
    if (!getMember) res.redirect("/");
    let passwordResult = await bcrypt.compare(
      member_password,
      getMember.member_password
    );
    if (passwordResult) {
      res.redirect("/chat");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/entry", async (req, res, next) => {
  res.render("entry");
});

router.post("/entry", async (req, res) => {
  let {
    email,
    member_password,
    name,
    profile_img_path,
    telephone,
    birth_date,
    entry_type_code,
  } = req.body;

  member_password = await bcrypt.hash(member_password, 12);
  email = await aes.encrypt(email, process.env.MYSQL_AES_KEY);
  telephone = await aes.encrypt(telephone, process.env.MYSQL_AES_KEY);

  let newMember = {
    email,
    member_password,
    name,
    profile_img_path: "/img/1.jpg",
    telephone,
    entry_type_code,
    use_state_code: 1,
    reg_member_id: 1,
    reg_date: Date.now(),
    birth_date,
  };

  try {
    let result = await db.Member.create(newMember);
    console.log("result : ", result);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

router.get("/find", async (req, res, next) => {
  res.render("find");
});

router.post("/find", async (req, res) => {
  res.redirect("login");
});

//JWT토큰 생성 웹페이지 요청화 응답
router.get("/maketoken", async (req, res, next) => {
  var token = "";
  res.render("maketoken", { layout: false, token });
});

//JWT 토큰 생성하고 토큰 확인하기
router.post("/maketoken", async (req, res) => {
  var token = "";

  //jwt 토큰에 담을 json 데이터 구조 및 데이터 바인딩
  //jwt 토큰 영역내 payload 영역에 담깁니다.
  var jsonTokenData = ({ usrid, email, usertype, name, telephone } = req.body);
  token = jwt.sign(jsonTokenData, process.env.JWT_SECRET, {
    expiresIn: "24h",
    issuer: "msoftware",
  });
  res.render("maketoken", { layout: false, token });
});

//127.0.0.1:3000/readtoken?token=토큰값
//이거는 query방식
router.get("/readtoken", async (req, res, next) => {
  var token = req.query.token;

  try {
    var jsonTokenData = await jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    token = "유효하지 않은 토큰";
    var jsonTokenData = {
      usrid: "",
      email: "",
      usertype: "",
      name: "",
      telephone: "",
    };
  }

  res.render("readtoken", { layout: false, token, jsonTokenData });
});
module.exports = router;
