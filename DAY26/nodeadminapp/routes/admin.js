var express = require("express");
var router = express.Router();
var moment = require("moment");

const Admin = require("../schemas/admin");
/* GET home page. */

router.get("/list", async (req, res, next) => {
  var searchOption = {
    dept_name: "전체",
    email: "",
    name: "",
  };
  const admin_members = await Admin.find({});
  res.render("admin/list", { admin_members, searchOption, moment });
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
  const filteredObject = Object.keys(searchOption).reduce((acc, key) => {
    if (searchOption[key] !== "") {
      acc[key] = searchOption[key];
    }
    return acc;
  }, {});

  const admin_members = await Admin.find(filteredObject);

  console.log("searchOption : ", searchOption);
  console.log("filteredObject : ", filteredObject, { dept_name });
  console.log("post list admin : ", admin_members);
  res.render("admin/list", { admin_members, searchOption, moment });
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
    reg_user_id: 99,
    edit_user_id: 99,
    edit_date: Date.now(),
    reg_date: Date.now(),
  };
  await Admin.create(admin);
  console.log("admin : ", admin);
  res.redirect("/admin/list");
});

router.get("/modify/:admin_member_id", async (req, res, next) => {
  var admin_member_id = req.params.admin_member_id;
  if (admin_member_id === undefined) res.send("error");
  else {
    const admin = await Admin.findOne({ admin_member_id });

    res.render("admin/modify", { admin });
  }
});

router.post("/modify/:admin_member_id", async (req, res, next) => {
  var admin_member_id = req.params.admin_member_id;
  if (admin_member_id === undefined) res.send("error!");
  else {
    const admin = await Admin.findOne({ admin_member_id });
    admin.company_code = req.body.company_code;
    admin.admin_password = req.body.admin_password;
    admin.admin_name = req.body.admin_name;
    admin.email = req.body.email;
    admin.telephone = req.body.telephone;
    admin.dept_name = req.body.dept_name;
    admin.used_yn_code = req.body.used_yn_code;
    admin.reg_user_id = req.body.reg_user_id;
    admin.edit_user_id = req.body.edit_user_id;
    admin.edit_date = Date.now();

    console.log("modify post admin : ", JSON.stringify(admin, null, 2));
    await Admin.updateOne({ admin_member_id: admin_member_id }, admin);
    res.redirect("/admin/list");
  }
});

router.get("/delete", async (req, res, next) => {
  var admin_id = req.query.admin_id;
  console.log("admin_id in delte ", admin_id);
  res.redirect("/admin");
});

module.exports = router;
