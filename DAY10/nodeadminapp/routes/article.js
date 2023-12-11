var express = require("express");
var router = express.Router();

/*
  게시글 목록 웹페이지 요청과 응답 처리 라우팅 메소드
  http://localhost:3000/articles
  요청유형:get
  응답결과:게시글 목록 웹페이지
*/
router.get("/", async (req, res) => {
  //게시글 목록 뎅티ㅓ
  var articles = [
    {
      ariticleIdx: 1,
      title: "첫번째글 제목임",
      contents: "첫번째글 내용임",
      view_cnt: 100,
      display: "y",
      ipaddress: "111.111.111.111",
      registDate: Date.now(),
      registMemberId: "eddy",
    },
    {
      ariticleIdx: 2,
      title: "2번째글 제목임",
      contents: "2번째글 내용임",
      view_cnt: 200,
      display: "y",
      ipaddress: "222.111.111.111",
      registDate: Date.now(),
      registMemberId: "eddy2",
    },
    {
      ariticleIdx: 3,
      title: "3번째글 제목임",
      contents: "3번째글 내용임",
      view_cnt: 300,
      display: "y",
      ipaddress: "333.111.111.111",
      registDate: Date.now(),
      registMemberId: "eddy3",
    },
  ];

  res.render("articles/list.ejs", { articles });
});

router.get("/create", async (req, res) => {
  res.render("articles/create");
});
router.post("/create", async (req, res) => {
  var title = req.body.title;
  var contents = req.body.contents;
  var register = req.body.register;

  var article = {
    ariticleIdx: 0,
    title,
    contents,
    view_cnt: 300,
    display: "y",
    ipaddress: "333.111.111.111",
    registDate: Date.now(),
    registMemberId: register,
  };
  res.redirect("/articles");
});

router.get("/modify/:aid", async (req, res) => {
  var articleIdx = req.params.aid;

  var article = {
    articleIdx,
    title: "첫번째글 제목임",
    contents: "첫번째글 내용임",
    view_cnt: 100,
    display: "y",
    ipaddress: "111.111.111.111",
    registDate: Date.now(),
    registMemberId: "eddy",
  };

  res.render("articles/modify", { article });
});

router.post("/modify/:aid", async (req, res) => {
  var articleIdx = req.params.aid;
  var title = req.body.title;
  var contents = req.body.contents;
  var register = req.body.register;

  var article = {
    articleIdx,
    title,
    contents,
    view_cnt: 0,
    display: "y",
    ipaddress: "333.111.111.111",
    registDate: Date.now(),
    registMemberId: register,
  };
  res.redirect("/articles");
});
module.exports = router;
