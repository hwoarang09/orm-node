var express = require("express");
var router = express.Router();
var db = require("../models/index");
var Op = db.Sequelize.Op;
/* GET home page. */
// var admin_members = [
//   {
//     company_code: 1,
//     admin_id: "ysungwon_admin1",
//     admin_password: "ysungwon_password1",
//     admin_name: "ysungwon1",
//     email: "ysungwon1@google.com",
//     telephone: "01022883839",
//     dept_name: "개발부",
//     used_yn_code: 1,
//     reg_user_id: 1,
//     edit_user_id: 1,
//     edit_date: Date.now(),
//     reg_date: Date.now(),
//   },
//   {
//     company_code: 1,
//     admin_id: "ysungwon_admin2",
//     admin_password: "ysungwon_password2",
//     admin_name: "ysungwon2",
//     email: "ysungwon2@google.com",
//     telephone: "01122883839",
//     dept_name: "영업부",
//     used_yn_code: 1,
//     reg_user_id: 2,
//     edit_user_id: 2,
//     edit_date: Date.now(),
//     reg_date: Date.now(),
//   },
//   {
//     company_code: 1,
//     admin_id: "ysungwon_admin3",
//     admin_password: "ysungwon_password3",
//     admin_name: "ysungwon3",
//     email: "ysungwon3@google.com",
//     telephone: "01222883839",
//     dept_name: "선도부",
//     used_yn_code: 0,
//     reg_user_id: 3,
//     edit_user_id: 3,
//     edit_date: Date.now(),
//     reg_date: Date.now(),
//   },
// ];
router.get("/list", async (req, res, next) => {
  var searchOption = {
    dept_name: "전체",
    email: "1@a",
    name: "이름",
  };

  var admin_members = await db.Admin.findAll({
    attribute: [
      "company_code",
      "admin_id",
      "admin_password",
      "admin_name",
      "email",
      "telephone",
      "dept_name",
      "used_yn_code",
      "reg_user_id",
      "edit_user_id",
      "edit_date",
      "reg_date",
    ],
  });
  admin_members = admin_members.map((arr) => {
    return arr.dataValues;
  });
  console.log("admin_members : ", admin_members);
  res.render("admin/list", { admin_members, searchOption });
});
router.post("/list", async (req, res) => {
  var dept_name = req.body.dept_name;
  var email = req.body.email;
  var name = req.body.name;

  var searchOption = {
    dept_name,
    email,
    name,
  };

  var admin_members = await db.Admin.findAll({
    where: { dept_name: searchOption.dept_name },
  });
  admin_members = admin_members.map((arr) => {
    return arr.dataValues;
  });

  res.render("admin/list", { admin_members, searchOption });
});
router.get("/create", async (req, res, next) => {
  res.render("admin/create");
});

router.post("/create", async (req, res, next) => {
  var company_code = req.body.company_code;
  var admin_id = req.body.admin_id;
  var admin_password = req.body.admin_password;
  var admin_name = req.body.admin_name;
  var email = req.body.email;
  var telephone = req.body.telephone;
  var dept_name = req.body.dept_name;
  var used_yn_code = req.body.used_yn_code;
  var reg_user_id = req.body.reg_user_id;
  var edit_user_id = req.body.edit_user_id;

  var admin = {
    company_code,
    admin_id,
    admin_password,
    admin_name,
    email,
    telephone,
    dept_name,
    used_yn_code: 1,
    reg_user_id: 1,
    edit_user_id,
    edit_date: Date.now(),
    reg_date: Date.now(),
  };
  await db.Admin.create(admin);
  console.log("admin : ", admin);
  res.redirect("/admin/list");
});

router.get("/modify/:admin_member_id", async (req, res, next) => {
  var admin_member_id = req.params.admin_member_id;
  const admin = await db.Admin.findOne({
    where: { admin_member_id: admin_member_id },
  });

  res.render("admin/modify", { admin });
});

router.post("/modify/:admin_member_id", async (req, res, next) => {
  var company_code = req.body.company_code;
  var admin_member_id = req.params.admin_member_id;
  var admin_password = req.body.admin_password;
  var admin_name = req.body.admin_name;
  var email = req.body.email;
  var telephone = req.body.telephone;
  var dept_name = req.body.dept_name;
  var used_yn_code = req.body.used_yn_code;
  var reg_user_id = req.body.reg_user_id;
  var edit_user_id = req.body.edit_user_id;

  var admin = {
    company_code,
    admin_member_id,
    admin_password,
    admin_name,
    email,
    telephone,
    dept_name,
    used_yn_code,
    reg_user_id,
    edit_user_id,
    edit_date: Date.now(),
    reg_date: Date.now(),
  };

  console.log("admin modify: ", admin);
  await db.Admin.update(admin, {
    where: { admin_member_id: admin_member_id },
  });
  res.redirect("/admin/list");
});

router.get("/delete", async (req, res, next) => {
  var admin_id = req.query.admin_id;
  console.log("admin_id in delte ", admin_id);
  res.redirect("/admin");
});

module.exports = router;
