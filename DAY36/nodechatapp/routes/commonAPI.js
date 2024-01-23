// 파일업로드 RESTful API 전용 라우팅
// http://localhost:3000/api/common/~

var express = require("express");
var router = express.Router();

// multer 멀티 업로드 패키지 참조
var multer = require("multer");
var moment = require("moment");

//util
const { apiResultSetFunc } = require("./utils/utiles");

// 파일저장위치 지정
var storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/upload/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${moment(Date.now()).format("YYYYMMDDHHMMss")}__${file.originalname}`
    );
  },
});

// 업로드 처리 객체 생성
var simpleUpload = multer({ storage: storage });

// db 연결
var db = require("../models/member");
var sequelize = db.sequelize;

// 파일 업로드 API
router.post("/upload", simpleUpload.single("file"), async (req, res) => {
  var apiResult = apiResultSetFunc(400, null, "");
  try {
    // 파일이 입력되지 않았을 경우
    if (!req.file) {
      apiResult = apiResultSetFunc(
        400,
        null,
        "파일이 제대로 업로드되지 않았습니다."
      );
    }

    // 업로드된 파일 정보 추출
    const uploadFile = req.file;
    const filePath = "upload/" + uploadFile.filename;

    apiResult = apiResultSetFunc(200, filePath, "파일 업로드 성공");
  } catch (err) {
    apiResult = apiResultSetFunc(500, null, "서버 에러");
  }
  res.json(apiResult);
});

module.exports = router;
