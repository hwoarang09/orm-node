let express = require("express");
let router = express.Router();
const path = require("path");
const app = express();
let db = require("../models/index");
let Op = db.Sequelize.Op;
const bcrypt = require("bcryptjs");
const aes = require("mysql-aes");
var jwt = require("jsonwebtoken");
const { mergeByKey, apiResultSetFunc } = require("./utils/utiles");
const { tokenAuthChecking } = require("./apiMiddleware");
//login api
//에러처리
//1. http://localhost:3000/api/member/login/1 -> 정의되지 않은 라우터경로 처리
//2. http://localhost:3000/api/member/login "email" : "hwoarang09@naver.com11" 이메일이 db에없는 경우
// {
//   "success": false,
//   "message": "No member"
// }
//3. http://localhost:3000/api/member/login  email이 db에 존재하는데 password를 틀릴 경우
// {
//   "success": false,
//   "message": "Password Wrong"
// }
router.post("/login", async (req, res, next) => {
  let apiResult = apiResultSetFunc(200, "기본data", "기본resutl");

  try {
    let { email, member_password } = req.body;
    console.log(email, member_password);
    email = aes.encrypt(email, process.env.MYSQL_AES_KEY);
    const member = await db.Member.findOne({
      where: {
        email,
      },
    });

    if (!member)
      apiResult = apiResultSetFunc(
        400,
        "NotExistEmail",
        "해당 이메일의 유저가 존재하지 않습니다."
      );
    else {
      let passwordResult = await bcrypt.compare(
        member_password,
        member.member_password
      );
      if (!passwordResult)
        apiResult = apiResultSetFunc(
          400,
          "NotCorrectword",
          "비밀번호가 틀렸습니다."
        );
      else {
        var memberTokenData = {
          member_id: member.member_id,
          email: member.email,
          name: member.name,
          profile_img_path: member.profile_img_path,
          telephone: member.telephone,
        };

        var token = await jwt.sign(memberTokenData, process.env.JWT_SECRET, {
          expiresIn: "24h",
          issuer: "msoftware",
        });
        apiResult = apiResultSetFunc(200, token, "로그인에 성공했습니다.");
      }
    }
  } catch (err) {
    console.error("Error in member POST /login:", err);
    apiResult = apiResultSetFunc(500, null, "failed or server error!");
  }

  res.json(apiResult);
});

//entry api
router.post("/entry", async (req, res, next) => {
  let apiResult = apiResultSetFunc(200, "기본data", "기본resutl");

  try {
    let member = {
      email: req.body.email,
      member_password: req.body.member_password,
      name: req.body.name,
      profile_img_path: "./upload/default.jpg",
      telephone: req.body.telephone,
      entry_type_code: req.body.entry_type_code,
      use_state_code: 1,
      birth_date: req.body.birth_date,
      reg_date: Date.now(),
      reg_member_id: 1,
      edit_date: Date.now(),
      edit_member_id: 1,
    };

    member.member_password = await bcrypt.hash(member.member_password, 12);
    member.email = aes.encrypt(member.email, process.env.MYSQL_AES_KEY);
    member.telephone = aes.encrypt(member.telephone, process.env.MYSQL_AES_KEY);
    search_member = await db.Member.findOne({
      where: {
        email: member.email,
      },
    });

    if (search_member)
      apiResult = apiResultSetFunc(
        400,
        "AlreadyExistEmail",
        "해당 이메일의 유저가 이미 존재합니다."
      );
    else {
      let create_result = await db.Member.create(member);
      apiResult = apiResultSetFunc(
        200,
        create_result,
        "회원가입에 성공하셨습니다."
      );
    }
  } catch (err) {
    apiResult = apiResultSetFunc(500, null, "failed or server error! in entry");
  }
  res.json(apiResult);
});

//find api
router.post("/find", async (req, res, next) => {
  try {
    let { email } = req.body;
    let de_email = email;
    email = await aes.encrypt(email, process.env.MYSQL_AES_KEY);

    const member = await db.Member.findOne({
      where: {
        email,
      },
    });

    if (!member) {
      return res
        .status(400)
        .json({ success: false, message: "No member ...to find" });
    } else {
      return res.status(200).json({
        success: true,
        message: `${de_email}'s encrypted password is ${member.member_password}`,
      });
    }
  } catch (err) {
    console.error("Error in member POST /find:", err);
    res.status(500).send("Internal Server Error");
  }
});

//GET /all
//에러처리
//1. http://localhost:3000/api/member/all/1 -> 정의되지 않은 라우터경로 처리
router.get("/all", async (req, res, next) => {
  try {
    const member_list = await db.Member.findAll({});
    res.send(member_list);
  } catch (err) {
    console.error("Error in member GET /all:", err);
    res.status(500).send("error in GET all!!!");
  }
});

//POST /create
//에러처리
//1. http://localhost:3000/api/member/create body에서 use_state_code="a" -> catch문
//2. http://localhost:3000/api/member/create/1 -> 정의되지 않은 라우터경로 처리
router.post("/create", async (req, res, next) => {
  try {
    let member = {
      email: req.body.email,
      member_password: req.body.member_password,
      name: req.body.name,
      profile_img_path: req.body.profile_img_path,
      telephone: req.body.telephone,
      entry_type_code: req.body.entry_type_code,
      use_state_code: req.body.use_state_code,
      birth_date: req.body.birth_date,
      reg_date: Date.now(),
      reg_member_id: req.body.reg_member_id,
      edit_date: Date.now(),
      edit_member_id: req.body.edit_member_id,
    };

    member.member_password = await bcrypt.hash(member.member_password, 12);
    member.email = await aes.encrypt(member.email, process.env.MYSQL_AES_KEY);
    member.telephone = await aes.encrypt(
      member.telephone,
      process.env.MYSQL_AES_KEY
    );
    await db.Member.create(member);
    console.log("member create : ", member);
    res.status(200).send(member);
  } catch (err) {
    console.error("Error in member POST /create:", err);
    res.status(500).send("error in POST create!!!");
  }
});

//POST /modify
//에러처리
//1. http://localhost:3000/api/member/modify body에서 member_id="a" -> catch문
//2. http://localhost:3000/api/member/modify/1 -> 정의되지 않은 라우터경로 처리
//3. http://localhost:3000/api/member/modify에서 body에 member_id=999 -> member not found in modify 처리
router.post("/modify", async (req, res, next) => {
  let member_id = req.body.member_id;
  try {
    let member = await db.Member.findOne({
      where: {
        member_id,
      },
    });
    if (!member) {
      // 멤버를 찾지 못한 경우
      return res.status(404).send("db.Member.not found in modify");
    }
    let mergedObject = await mergeByKey(
      member.toJSON(),
      req.body,
      ["member_password"],
      ["email", "telephone"]
    );
    //console.log("member : ", member);
    console.log("mergedObject : ", mergedObject);
    mergedObject.edit_date = Date.now();
    mergedObject.reg_date = Date.now();
    await db.Member.update(mergedObject, {
      where: {
        member_id,
      },
    });
    res.status(200).send(member);
  } catch (err) {
    console.error("Error in member POST /modify:", err);
    res.status(500).send("error in POST modify!!!");
  }
});

//POST /delete
//에러처리
//1. http://localhost:3000/api/member/delete  -> body에 member id="ㅁㅁ"-> catch문
//2. http://localhost:3000/api/member/delete/1  -> 정의되지 않은 라우터 경로
//3. http://localhost:3000/api/member/delete -> body에 member id="999"-> member not found 처리
router.post("/delete", async (req, res, next) => {
  try {
    let member_id = req.body.member_id;
    let member = await db.Member.destroy({
      where: {
        member_id,
      },
    });

    if (!member || member.deletedCount === 0) {
      return res.status(404).send("db.Member.not found in POST delete");
    }
    //res.send(member);
    console.log("member_id in delte ", member_id, member);
    res.status(200).send({ member_id });
  } catch (err) {
    console.error("Error in member POST /delete:", err);
    res.status(500).send("error in POST /delete!!!");
  }
});

//GET /:mid
//에러처리
//1. http://localhost:3000/api/member/asd -> catch문
//2. http://localhost:3000/api/member/ -> 정의되지 않은 라우터경로 처리
//3. http://localhost:3000/api/member/999 -> member not found 처리

//현재 로그인한 유저의 정보를 token기반으로 출력
//로그인시 발급한 jwt토큰은 http header 영역에 포함되어 전달됨
router.get("/profile", tokenAuthChecking, async (req, res, next) => {
  console.log("/profile   start!!");
  var apiResult = {
    code: 400,
    data: null,
    msg: "",
  };

  try {
    console.log("/profile   try!!");
    //웹브라우저 헤더에서 사용자 jwt인증토큰값을 추출한다.
    var token = req.headers.authorization.split("Bearer ")[1];
    var tokenJsonData = await jwt.verify(token, process.env.JWT_SECRET);
    var loginMemberId = tokenJsonData.member_id;
    var loginMemberEmail = tokenJsonData.email;

    console.log("/profile   before dbMember!!");
    //최신의 정보를 가져오려고. 처음 로긴한 후 중간에 바꿨을 수도 있으니까.
    var dbMember = await db.Member.findOne({
      where: { member_id: loginMemberId },
      attributes: [
        "email",
        "name",
        "profile_img_path",
        "telephone",
        "birth_date",
      ],
    });

    dbMember.telephone = aes.decrypt(
      dbMember.telephone,
      process.env.MYSQL_AES_KEY
    );
    dbMember.email = aes.decrypt(dbMember.email, process.env.MYSQL_AES_KEY);
    apiResult.code = 200;
    apiResult.data = dbMember;
    apiResult.resultMsg = "Ok";
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.resultMsg = "Failed";
  }

  res.json(apiResult);
});

//profileModify
router.post("/profileModify", async (req, res, next) => {
  let apiResult = apiResultSetFunc(200, "기본data", "기본resutl");
  try {
    console.log("/profileModify   try!!");
    //웹브라우저 헤더에서 사용자 jwt인증토큰값을 추출한다.
    var token = req.headers.authorization.split("Bearer ")[1];
    var tokenJsonData = await jwt.verify(token, process.env.JWT_SECRET);
    var loginMemberId = tokenJsonData.member_id;
    var loginMemberEmail = tokenJsonData.email;

    console.log("/profileModify   before dbMember!!");

    //최신의 정보를 가져오려고. 처음 로긴한 후 중간에 바꿨을 수도 있으니까.
    var member = await db.Member.findOne({
      where: { member_id: loginMemberId },
    });
    console.log("수정전 member : ", member);
    console.log("프로필 수정용 Body11 : ", req.body);
    let mergedObject = await mergeByKey(
      member.toJSON(),
      req.body,
      [],
      ["email", "telephone"]
    );

    member.edit_date = Date.now();
    member.reg_date = Date.now();
    console.log("수정후 member : ", member);
    console.log("merged : ", mergedObject);
    try {
      let [updatedRows, updatedData] = await db.Member.update(mergedObject, {
        where: {
          member_id: member.member_id,
        },
      });
      console.log("ret : ", [updatedRows, updatedData]);
    } catch (err) {
      console.log("err : ", err);
    }

    if (!member)
      apiResult = apiResultSetFunc(
        400,
        "NotExistEmail",
        "해당 유저가 존재하지 않습니다."
      );
    else {
      //dbMember 수정 시작
      //let create_result = await db.Member.create(member);
      var memberTokenData = {
        member_id: member.member_id,
        email: member.email,
        name: member.name,
        profile_img_path: member.profile_img_path,
        telephone: member.telephone,
      };

      var token = await jwt.sign(memberTokenData, process.env.JWT_SECRET, {
        expiresIn: "24h",
        issuer: "msoftware",
      });
      apiResult = apiResultSetFunc(200, token, "정보 수정 했어요.");
    }
  } catch (err) {
    console.log("err : ", err);
    apiResult = apiResultSetFunc(500, null, "failed or server error! in entry");
  }
  res.json(apiResult);
});

//password change
router.post("/password/update", async (req, res, next) => {
  let apiResult = apiResultSetFunc(200, "기본data", "기본resutl");
  try {
    //웹브라우저 헤더에서 사용자 jwt인증토큰값을 추출한다.
    var token = req.headers.authorization.split("Bearer ")[1];
    var tokenJsonData = await jwt.verify(token, process.env.JWT_SECRET);
    var loginMemberId = tokenJsonData.member_id;
    var loginMemberEmail = tokenJsonData.email;

    //최신의 정보를 가져오려고. 처음 로긴한 후 중간에 바꿨을 수도 있으니까.
    var member = await db.Member.findOne({
      where: { member_id: loginMemberId },
    });

    if (!member)
      apiResult = apiResultSetFunc(
        400,
        "NotExistEmail",
        "해당 이메일의 유저가 존재하지 않습니다."
      );
    else {
      let passwordResult = await bcrypt.compare(
        req.body.currentPassword,
        member.member_password
      );
      if (!passwordResult)
        apiResult = apiResultSetFunc(
          400,
          "NotCorrectword",
          "비밀번호가 틀렸습니다."
        );
      else {
        var memberTokenData = {
          member_id: tokenJsonData.member_id,
          email: tokenJsonData.email,
          name: tokenJsonData.name,
          profile_img_path: tokenJsonData.profile_img_path,
          telephone: tokenJsonData.telephone,
        };

        var token = await jwt.sign(memberTokenData, process.env.JWT_SECRET, {
          expiresIn: "24h",
          issuer: "msoftware",
        });
        try {
          let member_password = await bcrypt.hash(req.body.newPassword, 12);
          let mergedObject = await mergeByKey(
            member.toJSON(),
            { member_password },
            [],
            []
          );
          let [updatedRows, updatedData] = await db.Member.update(
            mergedObject,
            {
              where: {
                member_id: tokenJsonData.member_id,
              },
            }
          );
          apiResult = apiResultSetFunc(
            200,
            token,
            "비밀번호 변경에 성공했습니다."
          );
          console.log("ret : ", [updatedRows, updatedData]);
        } catch (err) {
          console.log("err1 : ", err);
          apiResult = apiResultSetFunc(
            500,
            null,
            "failed or server error! in entry1"
          );
        }
      }
    }
  } catch (err) {
    console.log("err2 : ", err);
    apiResult = apiResultSetFunc(
      500,
      null,
      "failed or server error! in entry2"
    );
  }
  res.json(apiResult);
});
//아래의 에러처리 코드는 무조건 router정의가 다 끝난 최하단에 위치해야 함.
//위에서 정의하지 않은 라우터에 대한 모든 요청에 대해서
//Error 객체를 생성하는 아래의 미들웨어를 실행한다.
router.get("/:mid", async (req, res, next) => {
  try {
    let member_id = req.params.mid;
    const member = await db.Member.findOne({
      where: {
        member_id,
      },
    });
    //console.log(`member_id : ${member_id}  member : ${member}`);
    if (!member) {
      // 멤버를 찾지 못한 경우
      return res.status(404).send("db.Member.not found");
    } else {
      // 멤버를 찾은 경우
      res.status(200).send(member);
    }
  } catch (err) {
    console.error("Error in member GET /:mid", err);
    res.status(500).send("error in GET /:mid!!! ");
  }
});

router.use((req, res, next) => {
  const error = new Error("정의되지 않은 라우터 경로입니다.");
  error.status = 404;
  next(error);
});

//위에서 받은 Error객체를 통해 화면에 처리하는 미들웨어
router.use((err, req, res, next) => {
  //console.log(err);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

module.exports = router;
