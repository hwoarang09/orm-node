//로그인 한 경우에만 요청해야 하는 페이지인데,
//로그인 안한 상태에서 요청하면 로그인 페이지로 이동시킬 때 씀.
exports.isLoggedIn = (req, res, next) => {
  //값이 있으면
  if (req.session.loginUser != undefined) {
    //값이 있으면, 현재 사용자가 로그인 상태니까
    //요청한 라우팅 메소드로 흘러가게 둔다.
    next();
  } else {
    //로그인 안했으면
    res.redirect("/login");
  }
};

//로그인을 한 상태에서 회원가입을 하려고하면???
//말이 안되잖아. 로그인을 안한 상태인지 확인하는 것
exports.isNotLoggedIn = (req, res, next) => {
  if (req.session.loginUser == undefined) {
    //로그인을 안한 경우에만 다음 메소드로 통과시킴
    next();
  } else {
    //로그인을 한 상태면 /로 보내기
    res.redirect("/");
  }
};
