var express = require("express");
var router = express.Router();

var moment = require('moment');

//ORM db객체를 참조
var db = require('../models/index');



/*게시글 목록 정보 조회 웹페이지 요청 라우팅 메소드*/
router.get("/list", async (req, res, next) => {

  var searchOption = {
    title: "",
    articleTypeCode: "9",
    isDisplayCode: "9"
  };

  var articles = await db.Article.findAll();


  res.render("article/list", { articles,moment,searchOption });
});



router.post("/list", async (req, res) => {
  var title = req.body.title;
  var articleTypeCode = req.body.articleTypeCode;
  var isDisplayCode = req.body.isDisplayCode;

  var searchOption = {
    title,
    articleTypeCode,
    isDisplayCode,
  };


  var articles = [];

  res.render("article/list", { articles,searchOption });
});



//신규 게시글 등록 웹페이지 요청
router.get("/create", async (req, res, next) => {

  res.render("article/create");
});

//신규 게시글 정보를 등록처리
router.post("/create", async (req, res, next) => {
  var title = req.body.title;
  var contents = req.body.contents;
  var articleTypeCode = req.body.articleTypeCode;
  var isDisplayCode = req.body.isDisplayCode;


  var article = {
    board_type_code:2,
    title,
    contents,
    article_type_code:articleTypeCode,
    view_count:0,
    is_display_code:isDisplayCode,
    ip_address:"111.111.111.111",
    reg_date:Date.now(),
    reg_member_id:0,
    edit_date:Date.now(),
    edit_member_id:0
  };

  
  var registedArticle = await db.Article.create(article);


  res.redirect("/article/list");
});




//기존 게시글 정보를 삭제처리
router.get("/delete", async (req, res, next) => {

  var articleIdx = req.query.aid;


  var deleteCnt = await db.Article.destroy({
    where:{article_id:articleIdx}
  });

  res.redirect("/article/list");
});



//기존 게시글 정보 확인 및 수정 웹페이지 요청
router.get("/modify/:aid", async (req, res, next) => {

  //선택한 게시글 고유번호를 파라메터 방식으로 URL을 통해 전달받음.
  var articleIdx = req.params.aid;


    var article = await db.Article.findOne({
      where:{ article_id : articleIdx }
    });

    res.render("article/modify", { article,moment });
  }
);


//기존 게시글 정보를 수정처리
router.post("/modify/:aid", async (req, res, next) => {

  var articleIdx = req.params.aid;


  var updateArticle = {
    title:req.body.title,
    article_type_code:req.body.articleTypeCode,
    contents:req.body.contents,
    ip_address:"222.222.222.222",
    is_display_code:req.body.isDisplayCode,
    edit_date:Date.now(),
    edit_member_id:0
  };

  var updatedCnt = await db.Article.update(updateArticle,{
    where:{article_id:articleIdx}
  });

  res.redirect("/article/list");
});




module.exports = router;
