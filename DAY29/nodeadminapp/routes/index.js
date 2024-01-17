const express = require("express");
const router = express.Router();
const db = require("../models/index");
const bcrypt = require("bcryptjs");
var session = require("express-session");
var { isLoggedIn, isNotLoggedIn } = require("./sessionMiddleware");
/*
-관리자 웹사이트의 로그인 웹페이지를 제공하는 라우팅 메소드
-사용자 계정정보가 아닌 관리자 계정정보를 통한 로그인을 시도합니다
-http://localhost:3001
*/

//isLoggedIn,
router.get("/", async (req, res) => res.render("login", { layout: false }));

//isNotLoggedIn,
router.get("/login", async (req, res) => {
  //세션으로 로그인한 사용자 정보 추출
  var sessionData = req.session;
  console.log(sessionData);
  res.render("login", { layout: false, resultMessage: "" });
});

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

      var sessionLoginData = {
        admin_member_id: admin.admin_member_id,
        company_code: admin.company_code,
        admin_id: admin.admin_id,
        admin_name: admin.admin_name,
      };
      console.log("req.session : ", req.session);
      req.session.loginUser = sessionLoginData;
      //save메소드를 호출해서 동적속성에 저장된 신규속성을 저장한다.
      //save호출과 동시에 쿠키파일이 서버에서 생ㅅ어되고 생성된 쿠키파일이
      //사용자 웹브라우저에 전달된다.
      //저장된 쿠키파일은 이후 해당 사이트 요청이 있을때마다 전달된다.
      //전단된 쿠키정보를 이용해 서버 메모리상의 세선정보를 이용해 로긍니한 사용자정보를 추출한다.
      req.session.save(function () {
        resultMessage = "로그인 성공";
        console.log(resultMessage);
        res.redirect("/");
      });
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
