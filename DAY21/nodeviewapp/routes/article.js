var express = require("express");
var router = express.Router();

const db = require("../models/index");
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const { QueryTypes } = sequelize;

router.get("/list", async (req, res, next) => {
  var searchOption = {
    boardTypeCode: "0",
    title: "기본",
    isDisplayCode: "9",
  };

  var articles = await db.Article.findAll({
    attributes: [
      "article_id",
      "board_type_code",
      "title",
      "article_type_code",
      "view_count",
      "is_display_code",
      "reg_member_id",
      "ip_address",
      "reg_date",
    ],
    where: {
      is_display_code: 1,
      view_count: { [Op.not]: 1234 },
    },
    order: [["article_id", "DESC"]],
  });
  articles = articles.map((arr) => {
    return arr.dataValues;
  });
  // ㄴSELECT article_id FOROM article WHRE is
  // var articles = await db.Article.findAll({
  //   attributes: [
  //     'article_id',
  //     'board_type_code',
  //     'title',
  //     'article_type_code',
  //     'view_count',
  //     'is_display_code',
  //     'reg_member_id',
  //   ],
  //   where: {
  //     is_display_code: 1,
  //     // view_count: { [Op.not]: 0 }
  //   },
  //   order: [['article_id', 'DESC']],
  // });

  // const sqlQuery = `SELECT article_id,board_type_code,title,article_type_code,view_count,ip_address,is_display_code,reg_date,reg_member_id
  // FROM article
  // WHERE is_display_code = 1
  // ORDER BY article_id DESC;
  // `;

  // var articles = await sequelize.query(
  //   "CALL SP_CHAT_ARTICLE_DISPLAY (:P_DISPLAY_CODE)",
  //   { replacements: { P_DISPLAY_CODE: searchOption.isDisplayCode } }
  // );

  // const articles = await sequelize.query(sqlQuery, {
  //   raw: true,
  //   type: QueryTypes.SELECT,
  // });

  // SELECT COUNT(*) FROM Articles
  const articleCount = await db.Article.count();

  console.log("articles : ", articles);
  res.render("article/list", { articles, searchOption, articleCount });
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
  // const articles_filtered = articles.filter((article) => {
  //   console.log("article : ", JSON.stringify(article, null, 2));
  //   console.log(
  //     article.boardTypeCode,
  //     boardTypeCode,
  //     article.boardTypeCode === boardTypeCode
  //   );
  //   if (
  //     article.boardTypeCode === Number(boardTypeCode) &&
  //     article.isDisplayCode === Number(isDisplayCode)
  //   )
  //     return article;
  // });
  // var articles = await db.Article.findAll({
  //   where: { board_type_code: searchOption.boardTypeCode },
  // });
  // articles = articles.map((arr) => {
  //   return arr.dataValues;
  // });
  var articles = await db.Article.findAll({
    where: { board_type_code: searchOption.boardTypeCode },
  });

  const articleCount = await db.Article.count();
  res.render("article/list", { articles, searchOption, articleCount });
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
    board_type_code: boardTypeCode,
    title,
    contents,
    view_count: 0,
    ip_address: "111.111.111.111",
    article_type_code: articleTypeCode,
    is_display_code: isDisplayCode,
    reg_member_id: 1,

    reg_date: Date.now(),
  };
  //어쩔때 redirect?? render??
  //post에 관련잇는 게 아니라 비지니스 관점에 따라 다름
  //case1) 등록완료 메세지를 사용자에게 알려주고. -> 확인버튼 누르면 게시글목록 페이지로 이동처리
  //case2) 친절하게 완료 메세지 안 알려줘도 된다??그럼 redirect가능
  await db.Article.create(article);
  res.redirect("/article/list");
});

router.get("/delete", async (req, res, next) => {
  var articleIdx = req.query.aid;
  await db.Article.destroy({ where: { article_id: articleIdx } });
  res.redirect("/article/list");
});

router.get("/modify/:aid", async (req, res, next) => {
  //선택한 게시글 고유번호를 파라메터 방식으로 URL을 통해 전달받음.
  var articleIdx = req.params.aid;
  const article = await db.Article.findOne({
    where: { article_id: articleIdx },
  });

  console.log("test modify get, aid : ", articleIdx);
  res.render("article/modify.ejs", { article });
  // if (articleIdx === undefined) res.send("error");
  // else {
  //   var article = articles.filter((article) => {
  //     if (article.articleId === Number(articleIdx)) return article;
  //   })[0];

  //   console.log("modify article : ", JSON.stringify(article, null, 2));

  //   res.render("article/modify", { article });
  // }
});
router.post("/modify/:aid", async (req, res, next) => {
  var articleIdx = req.params.aid;
  const boardTypeCode = req.body.boardTypeCode;
  const title = req.body.title;
  const contents = req.body.contents;
  const articleTypeCode = req.body.articleTypeCode;
  const isDisplayCode = req.body.isDisplayCode;
  const register = req.body.register;

  //STEP2 :추출된 사용자 입력데이터를 단일 게시글 json데이터로 구성해,
  //DB article테이블에 수정처리
  //수정 처리하면 처리건수값이 반환

  //수정할 게시글 데이터
  const article = {
    board_type_code: boardTypeCode,
    title,
    contents,
    article_type_code: articleTypeCode,
    is_display_code: isDisplayCode,
    ip_address: "111.222.333.444",
    edit_member_id: 1,
    edit_date: Date.now(),
  };

  await db.Article.update(article, {
    where: { article_id: articleIdx },
  });

  //STEP3 :수정처리후 게시글 목록 웹페이지로 이동처리
  res.redirect("/article/list");
  // var article = articles.filter((article) => {
  //   if (article.articleId === Number(articleIdx)) return article;
  // })[0];
  // console.log("modify post article : ", JSON.stringify(article, null, 2));
  // res.redirect("/article/list");
});

module.exports = router;
