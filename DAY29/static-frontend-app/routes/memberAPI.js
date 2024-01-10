let express = require("express");
let router = express.Router();
const path = require("path");
const app = express();
let db = require("../models/index");
let Op = db.Sequelize.Op;

const bcrypt = require("bcryptjs");
const aes = require("mysql-aes");
//각종 라이브러리

//개인용 util
const { mergeByKey } = require("./utils/utiles");

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
  try {
    let { email, password } = req.body;
    email = aes.encrypt(email, process.env.MYSQL_AES_KEY);
    const member = await db.Member.findOne({
      where: {
        email,
      },
    });

    if (!member)
      return res.status(400).json({ success: false, message: "No member" });

    let passwordResult = await bcrypt.compare(password, member.member_password);

    if (!passwordResult)
      return res
        .status(400)
        .json({ success: false, message: "Password Wrong" });
    else
      return res.status(200).json({ success: true, message: "Login success" });
  } catch (err) {
    console.error("Error in member POST /login:", err);
    res.status(500).send("Internal Server Error");
  }
});

//entry api

router.post("/entry", async (req, res, next) => {
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
    member.email = aes.encrypt(member.email, process.env.MYSQL_AES_KEY);
    member.telephone = aes.encrypt(member.telephone, process.env.MYSQL_AES_KEY);
    console.log("member : ", member);
    member = await db.Member.findOne({
      where: {
        email,
      },
    });

    if (member) {
      return res
        .status(400)
        .json({ success: false, message: "Already db.Member.exists" });
    } else {
      let result = await db.Member.create(member);
      console.log("create result : ", result);
      return res.status(200).json({ success: true, message: "Create Success" });
    }
  } catch (err) {
    console.error("Error in member POST /entry:", err);
    res.status(500).send("Internal Server Error");
  }
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
router.get("/:mid", async (req, res, next) => {
  try {
    let member_id = req.params.mid;
    const member = await db.Member.findOne({
      where: {
        member_id,
      },
    });
    console.log(`member_id : ${member_id}  member : ${member}`);
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

//아래의 에러처리 코드는 무조건 router정의가 다 끝난 최하단에 위치해야 함.
//위에서 정의하지 않은 라우터에 대한 모든 요청에 대해서
//Error 객체를 생성하는 아래의 미들웨어를 실행한다.
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
