//롴러 사용자 인증 전략 몯류 참조하기 - 직접 사용자 가입 및 로그인 구현
const local = require("./localStrategy");

//해당 모듈에 패스포트 객체가 전달됩니다.
//회원 로그인하는 라우팅 메소드에서 전달되는 패스포트 객체를 전ㄷ라받아 사용함.
module.exports = (passport) => {
  //passport객체에 로그인 사용자의 세션정보를 세팅하는 함수
  //사용자 로그인 완료 후 로그인한 사용자 정보를 세션에 담아주는 함수
  passport.serializeUser((user, done) => {
    //로그인한 사용자 세션 데이터 정보를 세션영역에 바인딩해주는 역할
    done(null, user);
  });

  //바인딩된 세션 데이터를 조회하는 역할
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  //로컬 사용자 전략에 패스포트 객체를 전달하여 실제 사요자 로그인 기능을 구현합니다.
  local(passport);
};
