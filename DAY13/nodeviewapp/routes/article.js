var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/list", function (req, res, next) {
  const articles = [
    {
      article_id: 1,
      board_type_code: 1,
      title: "공지게시글1번글",
      contents: "1번글 내용",
      view_count: 10,
      ip_address: "111.111.123.44",
      is_display_code: 1,
      reg_date: "2023-12-12",
      reg_member_id: "eddy",
    },
    {
      article_id: 2,
      board_type_code: 2,
      title: "기술블로깅 1번글",
      contents: "2번글 내용",
      view_count: 12,
      ip_address: "111.111.123.42",
      is_display_code: 1,
      reg_date: "2023-12-22",
      reg_member_id: "eddy2",
    },
    {
      article_id: 3,
      board_type_code: 1,
      title: "공지게시글3번글",
      contents: "3번글 내용",
      view_count: 13,
      ip_address: "111.111.123.49",
      is_display_code: 2,
      reg_date: "2023-12-14",
      reg_member_id: "eddy3",
    },
  ];
  res.render("article/list", { articles });
});

router.post("/list", async (req, res) => {
  var boardTypeCode = req.body.boardTypeCode;
  var title = req.body.title;
  var isDisplayCode = req.body.isDisplayCode;

  const articles = [
    {
      article_id: 3,
      board_type_code: 1,
      title: "공지게시글3번글",
      contents: "3번글 내용",
      view_count: 13,
      ip_address: "111.111.123.49",
      is_display_code: 2,
      reg_date: "2023-12-14",
      reg_member_id: "eddy3",
    },
  ];
  res.render("article/list", { articles });
});
router.get("/create", function (req, res, next) {
  res.render("article/create");
});
router.post("/create", function (req, res, next) {
  res.redirect("/article/list");
});

router.get("/delete", async (req, res, next) => {
  var articleIdx = req.query.aid;
  res.render("article/list");
});

router.get("/modify/:aid", async (req, res, next) => {
  var articleIdx = req.params.aid;

  res.render("article/modify");
});
router.post("/modify/:aid", function (req, res, next) {
  var articleIdx = req.params.aid;

  res.redirect("/article/list");
});

module.exports = router;
