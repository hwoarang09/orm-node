const express = require("express");
const router = express.Router();
const db = require("../models/index");
const bcrypt = require("bcryptjs");
/*
-관리자 웹사이트의 로그인 웹페이지를 제공하는 라우팅 메소드
-사용자 계정정보가 아닌 관리자 계정정보를 통한 로그인을 시도합니다
-http://localhost:3001
*/
router.get("/", async (req, res) => res.render("login", { layout: false }));
router.get("/login", async (req, res) =>
  res.render("login", { layout: false, resultMessage: "" })
);

/*
-관리자 계정으로 로그인 성공 이후에 최초로 보여줄 관리자 웹사이트 메인페이지
-반드시 관리자 로그인 성공 후에 접속이 가능합니다
-http://localhost:3001
*/
router.post("/login", async (req, res) => {
  //step1
  let { admin_id, admin_password } = req.body;

  //step2
  const admin = await db.Admin.findOne({
    where: { admin_id },
  });
  var resultMessage = "";

  if (!admin) {
    resultMessage = "동일한 아이디가 존재하지 않습니다.";
    console.log(resultMessage, admin_password);
    res.render("login", { layout: false, resultMessage });
  } else {
    let passwordResult = await bcrypt.compare(
      admin_password,
      admin.admin_password
    );
    if (passwordResult) {
      //암호 맞음
      resultMessage = "로그인 성공";
      console.log(resultMessage);
      res.redirect("/");
    } else {
      //암호틀림
      resultMessage = "암호가 틀려용";
      console.log(resultMessage);
      res.render("login", { layout: false, resultMessage });
    }
  }
});

router.get("/main", async (req, res) => res.render("main"));

module.exports = router;
