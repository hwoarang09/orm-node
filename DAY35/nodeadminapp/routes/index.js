const express = require("express");
const router = express.Router();
const db = require("../models/index");
const bcrypt = require("bcryptjs");
var session = require("express-session");
//var { isLoggedIn, isNotLoggedIn } = require("./sessionMiddleware");
var { isLoggedIn, isNotLoggedIn } = require("./passportMiddleware");
const passport = require("passport");
/*
-관리자 웹사이트의 로그인 웹페이지를 제공하는 라우팅 메소드
-사용자 계정정보가 아닌 관리자 계정정보를 통한 로그인을 시도합니다
-http://localhost:3001
*/

//isLoggedIn,

router.get("/", isLoggedIn, async (req, res) => {
  res.render("index");
});

//isNotLoggedIn,
router.get("/login", isNotLoggedIn, async (req, res) => {
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
//express-session기반
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

//passport-local 기반 로그인
router.post("/passPortlogin", async (req, res, next) => {
  //패스포트 기반 로그인 인즈처리 메소드 호출하여 패스포트 기반으로 로그인 실시한다.
  //passport.authenticate('로그인전략=local', 패스포트 로그인 후 수행되는 콟맥함수=done(실행결과-정상,에러  , 세션데이터, 추가메세지))
  passport.authenticate("local", (authError, admin, info) => {
    //패스포트 인증시 에러가 발생한 경우
    if (authError) {
      console.log("authError", authError);
      return next(authError);
    }

    //로컬전략 파일에서 전달된 관리자 세션 데이터가 전달이 안된 경우...
    //동일 아이디가 없거나 암호가 틀린 경우 done('', fale) 두번째 파라미터의 값이 false로 온 거임.
    if (!admin) {
      //이동하기 전 데이터를 이동한 후에도 데이터에 쓸 수 있게 잠깐 저장해주는거라는데..이해가 안댐
      //req.flash('키명', 키값)
      req.flash("loginError", info.message);
      return res.redirect("/login");
    }

    //정상적으로 passport인증이 완료된 경우
    //req.login('세션으로 저장할 사용자데이터',처리결과 콜백함수)은 passport기반 정상 인증이 완료되면 passport세션을 생성해주는 기능제공
    return req.login(admin, (loginError) => {
      if (loginError) {
        console.log(loginError);
        return next(loginError);
      }

      //정상적으로 세션데이터가 세션에 반영된 경우 처리
      return res.redirect("/");
    });
  })(req, res, next);
});
router.get("/main", async (req, res) => res.render("main"));

module.exports = router;
