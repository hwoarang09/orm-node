var express = require("express");
var router = express.Router();
var moment = require("moment");
// const articles = [
//   {
//     articleId: 1,
//     boardTypeCode: 1,
//     title: "공지게시글1번글",
//     contents: "1번글 내용",
//     viewCount: 10,
//     ipAddress: "111.111.123.44",
//     articleTypeCode: 0,
//     isDisplayCode: 1,
//     regDate: "2023-12-12",
//     regMemberId: "eddy",
//   },
//   {
//     articleId: 2,
//     boardTypeCode: 2,
//     title: "기술블로깅 1번글",
//     contents: "2번글 내용",
//     viewCount: 12,
//     ipAddress: "111.111.123.42",
//     articleTypeCode: 1,
//     isDisplayCode: 1,
//     regDate: "2023-12-22",
//     regMemberId: "eddy2",
//   },
//   {
//     articleId: 3,
//     boardTypeCode: 1,
//     title: "공지게시글3번글",
//     contents: "3번글 내용",
//     viewCount: 13,
//     ipAddress: "111.111.123.49",
//     articleTypeCode: 1,
//     isDisplayCode: 0,
//     regDate: "2023-12-14",
//     regMemberId: "eddy3",
//   },
// ];

const Article = require("../schemas/article");
/* GET home page. */
router.get("/list", async (req, res, next) => {
  var searchOption = {
    boardTypeCode: "0",
    title: "기본",
    isDisplayCode: "9",
  };

  const articles = await Article.find({});
  console.log("articles : ", articles);
  res.render("article/list", { articles, searchOption, moment });
});

router.post("/list", async (req, res) => {
  var boardTypeCode = req.body.boardTypeCode;
  var title = req.body.title;
  var isDisplayCode = req.body.isDisplayCode;

  var searchOption = {
    boardTypeCode,
    title,
    isDisplayCode,
  };
  const articles = await Article.find({});
  const articles_filtered = articles.filter((article) => {
    console.log("article : ", JSON.stringify(article, null, 2));
    console.log(
      article.boardTypeCode,
      boardTypeCode,
      article.boardTypeCode === boardTypeCode
    );
    if (
      article.boardTypeCode === Number(boardTypeCode) &&
      article.isDisplayCode === Number(isDisplayCode)
    )
      return article;
  });

  console.log("searchOption : ", searchOption);
  console.log(
    "articles_filterd : ",
    JSON.stringify(articles_filtered, null, 2)
  );
  res.render("article/list", { articles: articles_filtered, searchOption });
});
router.get("/create", function (req, res, next) {
  res.render("article/create");
});
router.post("/create", async (req, res, next) => {
  var boardTypeCode = req.body.boardTypeCode;
  var title = req.body.title;
  var contents = req.body.contents;
  var articleTypeCode = req.body.articleTypeCode;
  var isDisplayCode = req.body.isDisplayCode;
  var register = req.body.register;

  var article = {
    title,
    contents,
    article_type_code: articleTypeCode,
    view_count: 0,
    is_display_code: isDisplayCode,
    edit_member_id: register,
    registDate: Date.now(),
  };
  //어쩔때 redirect?? render??
  //post에 관련잇는 게 아니라 비지니스 관점에 따라 다름
  //case1) 등록완료 메세지를 사용자에게 알려주고. -> 확인버튼 누르면 게시글목록 페이지로 이동처리
  //case2) 친절하게 완료 메세지 안 알려줘도 된다??그럼 redirect가능
  console.log("article : ", article);
  await Article.create(article);

  res.redirect("/article/list");
});

router.get("/delete/:aid", async (req, res, next) => {
  var articleIdx = req.params.aid;

  var result = await Article.deleteOne({ article_id: articleIdx });
  console.log("articleidx : ", articleIdx, result);

  res.redirect("/article/list");
});

router.get("/modify/:aid", async (req, res, next) => {
  //선택한 게시글 고유번호를 파라메터 방식으로 URL을 통해 전달받음.
  var articleIdx = req.params.aid;
  console.log("test modify get, aid : ", articleIdx);

  if (articleIdx === undefined) res.send("error");
  else {
    const article = await Article.findOne({});
    // var article = articles.filter((article) => {
    //   if (article.article_id === Number(articleIdx)) return article;
    // })[0];

    console.log("modify article : ", JSON.stringify(article, null, 2));

    res.render("article/modify", { article });
  }
});
router.post("/modify/:aid", async (req, res, next) => {
  var articleIdx = req.params.aid;

  var article = await Article.findOne({ article_id: articleIdx });
  var article = {
    title: req.body.title,
    contents: req.body.contents,
    article_type_code: req.body.articleTypeCode,
    view_count: article.view_count,
    is_display_code: req.body.isDisplayCode,
    edit_member_id: req.body.register,
    registDate: Date.now(),
  };
  await Article.updateOne({ article_id: articleIdx }, article);
  console.log("modify post article : ", JSON.stringify(article, null, 2));
  res.redirect("/article/list");
});

module.exports = router;
