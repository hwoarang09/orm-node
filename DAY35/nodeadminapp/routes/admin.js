const express = require("express");
const router = express.Router();
const db = require("../models/index");
const bcrypt = require("bcryptjs");
const aes = require("mysql-aes");
//var { isLoggedIn, isNotLoggedIn } = require("./sessionMiddleware");
var { isLoggedIn, isNotLoggedIn } = require("./passportMiddleware");
// router.use(isLoggedIn, async (req, res) => {
//   console.log("admin 로그인확인 미들웨어!!");
//   next();
// });

router.get("/list", isLoggedIn, async (req, res) => {
  let admins = await db.Admin.findAll({
    attributes: [
      "admin_member_id",
      "company_code",
      "admin_id",
      "admin_name",
      "email",
      "admin_password",
      "telephone",
      "used_yn_code",
      "reg_user_id",
      "reg_date",
      "edit_user_id",
      "edit_date",
    ],
  });
  admins = admins.map((admin) => {
    admin.email = aes.decrypt(admin.email, process.env.MYSQL_AES_KEY);
    admin.telephone = aes.decrypt(admin.telephone, process.env.MYSQL_AES_KEY);
    return admin;
  });
  res.render("admin/list", { admins });
});

router.post("/list", async (req, res) => {
  const { admin_name, admin_id, used_yn_code } = req.body;

  const searchOption = {
    admin_name,
    admin_id,
    used_yn_code,
  };

  try {
    if (admin_name) {
      const admins = await db.Admin.findAll({
        where: { admin_name: searchOption.admin_name },
      });
      res.render("admin/list", { admins });
    }

    if (admin_id) {
      const admins = await db.Admin.findAll({
        where: { admin_id: searchOption.admin_id },
      });
      res.render("admin/list", { admins });
    }

    if (used_yn_code) {
      const admins = await db.Admin.findAll({
        where: { used_yn_code: searchOption.used_yn_code },
      });
      res.render("admin/list", { admins });
    }
  } catch (error) {}
});

router.get("/create", async (req, res) => {
  res.render("admin/create");
});

router.post("/create", async (req, res) => {
  let {
    company_code,
    admin_id,
    admin_password,
    admin_name,
    email,
    telephone,
    used_yn_code,
    reg_user_id,
    reg_date,
  } = req.body;

  //관리자 암호를 해시 알고리즘 기반 단방향 암호화 적용하기
  //bcrypt.has('암호화할문자', 암호화변환횟수)
  admin_password = await bcrypt.hash(admin_password, 12);

  //메일은 양방향으로 해봄
  email = await aes.encrypt(email, process.env.MYSQL_AES_KEY);
  telephone = await aes.encrypt(telephone, process.env.MYSQL_AES_KEY);

  const newAdmin = {
    company_code,
    admin_id,
    admin_password,
    admin_name,
    email,
    telephone,
    used_yn_code,
    reg_user_id,
    reg_date,
    edit_user_id: null,
    edit_date: null,
  };

  await db.Admin.create(newAdmin);

  res.redirect("list");
});

router.get("/delete", async (req, res) => {
  res.render("admin/delete");
});

router.get("/modify/:id", async (req, res) => {
  const adminIndex = req.params.id;

  const admin = await db.Admin.findOne({
    where: { admin_member_id: adminIndex },
  });

  admin.email = aes.decrypt(admin.email, process.env.MYSQL_AES_KEY);
  admin.telephone = aes.decrypt(admin.telephone, process.env.MYSQL_AES_KEY);
  res.render("admin/modify", { admin });
});

router.post("/modify/:id", async (req, res) => {
  const adminIndex = req.params.id;
  const {
    admin_member_id,
    company_code,
    admin_id,
    used_yn_code,
    admin_name,
    telephone,
    reg_user_id,
    reg_date,
    edit_user_id,
    edit_date,
    action,
  } = req.body;

  if (action === "save") {
    const updateAdmin = {
      admin_member_id,
      company_code,
      admin_id,
      used_yn_code,
      admin_name,
      telephone,
      reg_user_id,
      reg_date,
      edit_user_id,
      edit_date,
    };

    await db.Admin.update(updateAdmin, {
      where: { admin_member_id: adminIndex },
    });
  } else {
    await db.Admin.destroy({ where: { admin_member_id: adminIndex } });
  }

  res.redirect("/admin/list");
});

module.exports = router;
