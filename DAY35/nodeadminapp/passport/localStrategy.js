var bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
var db = require("../models/index");

module.exports = (passport) => {
  //passport.use('new LocalStrategy('로그인화면의 아이디/암호 UI 요소으 ㅣ네임값 설정',
  //로그인처리 함수 정의(아이디값, 암호값, 후행콜백함수)));
  passport.use(
    new LocalStrategy(
      {
        usernameField: "admin_id",
        passwordField: "admin_password",
      },
      async (admin_id, admin_password, done) => {
        //사용자가 입력한 아이디/암호를 기반으로 로그인기능을 구현
        try {
          //step1 : 동일한 사용자 아이디 정보조회
          const admin = await db.Admin.findOne({ where: { admin_id } });

          if (admin) {
            const result = await bcrypt.compare(
              admin_password,
              admin.admin_password
            );
            if (result) {
              //아이디 암호 일치하는 경우
              var sessionLoginData = {
                admin_member_id: admin.admin_member_id,
                company_code: admin.company_code,
                admin_id: admin.admin_id,
                admin_name: admin.admin_name,
              };

              done(null, sessionLoginData);
            } else {
              //암호가 틀린 경우
              //done(null, 사용자세션데이터없으면 false, 추가옵션데이터)
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }
          } else {
            //아이디가 존재하지 않는 경우
            done(null, false, { message: "아이디가 일치하지 않습니다." });
          }
        } catch (err) {
          done(err);
        }
      }
    )
  );
};
