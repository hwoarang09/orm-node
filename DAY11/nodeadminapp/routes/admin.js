var express = require("express");
var router = express.Router();

/* GET home page. */

router.get("/list", async (req, res, next) => {
  var admin_members = [
    {
      company_code: 1,
      admin_id: "ysungwon_admin1",
      admin_password: "ysungwon_password1",
      admin_name: "ysungwon1",
      email: "ysungwon1@google.com",
      telephone: "01022883839",
      dept_name: "개발부",
      used_yn_code: 1,
      reg_user_id: 1,
      edit_user_id: 1,
      edit_date: Date.now(),
      reg_date: Date.now(),
    },
    {
      company_code: 1,
      admin_id: "ysungwon_admin2",
      admin_password: "ysungwon_password2",
      admin_name: "ysungwon2",
      email: "ysungwon2@google.com",
      telephone: "01122883839",
      dept_name: "영업부",
      used_yn_code: 1,
      reg_user_id: 2,
      edit_user_id: 2,
      edit_date: Date.now(),
      reg_date: Date.now(),
    },
    {
      company_code: 1,
      admin_id: "ysungwon_admin3",
      admin_password: "ysungwon_password3",
      admin_name: "ysungwon3",
      email: "ysungwon3@google.com",
      telephone: "01222883839",
      dept_name: "선도부",
      used_yn_code: 0,
      reg_user_id: 3,
      edit_user_id: 3,
      edit_date: Date.now(),
      reg_date: Date.now(),
    },
  ];

  res.render("admin/list", { admin_members });
});

router.get("/create", async (req, res, next) => {
  res.render("admin/create", { title: "admin/create" });
});

router.post("/create", async (req, res, next) => {
  res.redirect("/admin/list");
});

router.get("/modify", async (req, res, next) => {
  res.render("admin/modify", { title: "admin/modify" });
});

router.post("/modify", async (req, res, next) => {
  res.redirect("/admin/list");
});

router.get("/delete", async (req, res, next) => {
  res.redirect("/admin/list");
});

module.exports = router;
