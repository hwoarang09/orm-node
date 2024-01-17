var express = require("express");
var router = express.Router();

var moment = require("moment");
var multer = require("multer");

//var { isLoggedIn, isNotLoggedIn } = require("./sessionMiddleware");
var { isLoggedIn, isNotLoggedIn } = require("./passportMiddleware");

//s3전용 업로드 객체 참조

var { upload } = require("../common/aws_s3");
//파일저장위치 지정
var storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/upload/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${moment(Date.now()).format("yyyymmddHHMMSS")}__${file.originalname}`
    );
  },
});
//일반 업로드처리 객체 생성
var simpleupload = multer({ storage: storage });

//ORM db객체를 참조
var db = require("../models/index");

var { isLoggedIn, isNotLoggedIn } = require("./sessionMiddleware");

// router.use(isLoggedIn, async (req, res) => {
//   console.log("admin 로그인확인 미들웨어!!");
//   next();
// });

/*게시글 목록 정보 조회 웹페이지 요청 라우팅 메소드*/
//일반 파일 업로드 페이지 요청
router.get("/upload", async (req, res, next) => {
  res.render("article/upload");
});
//FORM 기반 파일 업로드 처리
router.post("/upload", simpleupload.single("file"), async (req, res, next) => {
  var title = req.body.title;
  var contents = req.body.contents;
  //업로드된 파일정보 추출
  const uploadFile = req.file;
  var filePath = "/upload/" + uploadFile.filename;
  var fileName = uploadFile.filename;
  var fileOrignalName = uploadFile.originalname;
  var fileSize = uploadFile.size;
  var fileType = uploadFile.mimetype;
  //데이터 저장처리하세용..
  res.redirect("/");
});

router.get("/list", async (req, res, next) => {
  var searchOption = {
    title: "",
    articleTypeCode: "9",
    isDisplayCode: "9",
  };

  var articles = await db.Article.findAll();

  res.render("article/list", { articles, moment, searchOption });
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

  res.render("article/list", { articles, searchOption });
});

//신규 게시글 등록 웹페이지 요청
router.get("/create", async (req, res, next) => {
  res.render("article/create");
});

//신규 게시글 정보를 등록처리
router.post("/create", simpleupload.single("file"), async (req, res, next) => {
  var title = req.body.title;
  var contents = req.body.contents;
  var articleTypeCode = req.body.articleTypeCode;
  var isDisplayCode = req.body.isDisplayCode;

  var article = {
    board_type_code: 2,
    title,
    contents,
    article_type_code: articleTypeCode,
    view_count: 0,
    is_display_code: isDisplayCode,
    ip_address: "111.111.111.111",
    reg_date: Date.now(),
    reg_member_id: 0,
    edit_date: Date.now(),
    edit_member_id: 0,
  };

  var registedArticle = await db.Article.create(article);
  console.log("regstsetartice : ", registedArticle);
  const uploadFile = req.file;
  console.log("uploadFile : ", uploadFile);
  if (uploadFile) {
    let filePath = "/upload/" + uploadFile.filename;
    var fileName = uploadFile.filename;
    var fileOrignalName = uploadFile.originalname;
    var fileSize = uploadFile.size;
    var fileType = uploadFile.mimetype;

    var file = {
      article_id: registedArticle.article_id,
      file_name: fileOrignalName,
      file_size: fileSize,
      file_path: filePath,
      file_type: fileType,
      reg_date: Date.now(),
      reg_member_id: 1,
    };
    console.log("file : ", file);
    let ret = await db.ArticleFile.create(file);
    console.log("ret : ", ret);
  }

  res.redirect("/article/list");
});

//s3에 파일업로드
router.post(
  "/creates3",
  upload.getUpload("upload/").fields([{ name: "file", maxCount: 1 }]),
  async (req, res, next) => {
    var title = req.body.title;
    var contents = req.body.contents;
    var articleTypeCode = req.body.articleTypeCode;
    var isDisplayCode = req.body.isDisplayCode;

    var article = {
      board_type_code: 2,
      title,
      contents,
      article_type_code: articleTypeCode,
      view_count: 0,
      is_display_code: isDisplayCode,
      ip_address: "111.111.111.111",
      reg_date: Date.now(),
      reg_member_id: 0,
      edit_date: Date.now(),
      edit_member_id: 0,
    };
    const uploadFile = req.files.file[0];
    var filePath = "/upload/" + uploadFile.filename;
    var fileName = uploadFile.filename;
    var fileOrignalName = uploadFile.originalname;
    var fileSize = uploadFile.size;
    var fileType = uploadFile.mimetype;
    var registedArticle = await db.Article.create(article);

    res.redirect("/article/list");
  }
);
//기존 게시글 정보를 삭제처리
router.get("/delete", async (req, res, next) => {
  var articleIdx = req.query.aid;

  var deleteCnt = await db.Article.destroy({
    where: { article_id: articleIdx },
  });

  res.redirect("/article/list");
});

//기존 게시글 정보 확인 및 수정 웹페이지 요청
router.get("/modify/:aid", async (req, res, next) => {
  //선택한 게시글 고유번호를 파라메터 방식으로 URL을 통해 전달받음.
  var articleIdx = req.params.aid;

  var article = await db.Article.findOne({
    where: { article_id: articleIdx },
  });

  res.render("article/modify", { article, moment });
});

//기존 게시글 정보를 수정처리
router.post("/modify/:aid", async (req, res, next) => {
  var articleIdx = req.params.aid;

  var updateArticle = {
    title: req.body.title,
    article_type_code: req.body.articleTypeCode,
    contents: req.body.contents,
    ip_address: "222.222.222.222",
    is_display_code: req.body.isDisplayCode,
    edit_date: Date.now(),
    edit_member_id: 0,
  };

  var updatedCnt = await db.Article.update(updateArticle, {
    where: { article_id: articleIdx },
  });

  res.redirect("/article/list");
});

module.exports = router;
