var express = require("express");
var router = express.Router();

var moment = require("moment");
var multer = require("multer");
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
var upload = multer({ storage: storage });
//전체리스트 api
//localhost:3000/api/article/all
var articles = [
  {
    articleId: 1,
    boardTypeCode: 1,
    title: "공지게시글1번글",
    contents: "1번글 내용",
    viewCount: 10,
    ipAddress: "111.111.123.44",
    articleTypeCode: 0,
    isDisplayCode: 1,
    regDate: "2023-12-12",
    regMemberId: "eddy",
  },
  {
    articleId: 2,
    boardTypeCode: 2,
    title: "기술블로깅 1번글",
    contents: "2번글 내용",
    viewCount: 12,
    ipAddress: "111.111.123.42",
    articleTypeCode: 1,
    isDisplayCode: 1,
    regDate: "2023-12-22",
    regMemberId: "eddy2",
  },
  {
    articleId: 3,
    boardTypeCode: 1,
    title: "공지게시글3번글",
    contents: "3번글 내용",
    viewCount: 13,
    ipAddress: "111.111.123.49",
    articleTypeCode: 1,
    isDisplayCode: 0,
    regDate: "2023-12-14",
    regMemberId: "eddy3",
  },
];

router.get("/all", async (req, res) => {
  var apiResult = {
    code: 200,
    data: [],
    result: "Ok",
  };

  //try구문에서 db에 요청해 데이터를 받아올 거임.
  try {
    apiResult.code = 200;
    apiResult.data = articles;
    apiResult.result = "OK";
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = [];
    apiResult.result = "FAILED";

    //실제 에러코드는 전송하지 않고 서버 내에서 출력만 함.
    console.log("articleAPI get /all error : ", err.message);
  }

  //에러가 나든 안나든 결과는 전송한다.
  res.json(apiResult);
});

//신규게시글 등록처리 api
//localhost:3000/api/article/create
router.post("/create", async (req, res) => {
  var apiResult = {
    code: 200,
    data: [],
    result: "Ok",
  };

  try {
    var boardTypeCode = req.body.boardTypeCode;
    var title = req.body.title;
    var contents = req.body.contents;
    var articleTypeCode = req.body.articleTypeCode;
    var isDisplayCode = req.body.isDisplayCode;
    var register = req.body.register;
    var registDate = Date.now();

    var article = {
      boardTypeCode,
      title,
      contents,
      articleTypeCode,
      isDisplayCode,
      register,
      registDate,
    };
    console.log("article create : ", JSON.stringify(article, null, 2));
    articles.push(article);
    apiResult.code = 200;
    apiResult.data = article;
    apiResult.result = "OK";
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = [];
    apiResult.result = "FAILED";

    //실제 에러코드는 전송하지 않고 서버 내에서 출력만 함.
    console.log("articleAPI get /all error : ", err.message);
  }
  res.json(apiResult);
});

//단일게시글 수정처리 api
//localhost:3000/api/article/update
router.post("/update", async (req, res) => {
  var apiResult = {
    code: 200,
    data: [],
    result: "Ok",
  };

  try {
    var articleId = req.body.articleId;
    var boardTypeCode = req.body.boardTypeCode;
    var title = req.body.title;
    var contents = req.body.contents;
    var articleTypeCode = req.body.articleTypeCode;
    var isDisplayCode = req.body.isDisplayCode;
    var register = req.body.register;
    var registDate = Date.now();

    var article = {
      articleId,
      boardTypeCode,
      title,
      contents,
      articleTypeCode,
      isDisplayCode,
      register,
      registDate,
    };
    console.log("article update : ", JSON.stringify(article, null, 2));
    //articles.push(article);
    apiResult.code = 200;
    apiResult.data = article;
    apiResult.result = "OK";
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = [];
    apiResult.result = "FAILED";

    //실제 에러코드는 전송하지 않고 서버 내에서 출력만 함.
    console.log("articleAPI get /all error : ", err.message);
  }
  res.json(apiResult);
});

//파일업로드
router.post("/upload", upload.single("file"), async (req, res) => {
  var apiResult = {
    code: 200,
    data: [],
    result: "Ok",
  };

  try {
    const uploadFile = req.file;
    let filePath = "/upload/" + uploadFile.filename;
    var fileName = uploadFile.filename;
    var fileOrignalName = uploadFile.originalname;
    var fileSize = uploadFile.size;
    var fileType = uploadFile.mimetype;

    apiResult.data = {
      filePath,
      fileName,
      fileOrignalName,
      fileSize,
      fileType,
    };
    apiResult.code = 200;
    apiResult.result = "Ok";
  } catch (err) {
    apiResult.code = 500;
    apiResult.result = "failed";
    apiResult.data = {};
  }
  res.json(apiResult);
});

//단일게시글 조회 api
//localhost:3000/api/article/1
router.get("/:aidx", async (req, res) => {
  var aidx = req.params.aidx;
  var data = articles.filter((article) => {
    console.log(aidx, article.articleId);
    if (Number(aidx) === article.articleId) {
      return article;
    }
  });

  if (data.length !== 0) {
    data = data[0];
  } else {
    data = {
      message: "no",
    };
  }

  console.log("aidx : ", aidx);
  console.log("data : ", data);
  var apiResult = {
    code: 200,
    data,
    result: "Ok2",
  };

  res.json(apiResult);
});

//단일게시글 삭제 api
//localhost:3000/api/article/1
router.delete("/:aidx", async (req, res) => {
  var apiResult = {
    code: 200,
    data: [],
    result: "Ok",
  };

  var deletedCnt = { 테스트: "test" };
  try {
    var articleId = req.params.aidx;

    apiResult.code = 200;
    apiResult.data = deletedCnt;
    apiResult.result = "OK";
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = {};
    apiResult.result = "FAILED";
    console.log("aricle delte error : ", JSON.stringify(err.message, null, 2));
  }
  res.json(apiResult);
});
module.exports = router;
