var express = require("express");
var router = express.Router();

/* GET home page. */

router.get("/list", function (req, res, next) {
  res.render("admin/list", { title: "admin/list" });
});

router.get("/create", function (req, res, next) {
  res.render("admin/create", { title: "admin/create" });
});

router.post("/create", function (req, res, next) {
  res.redirect("/admin/list");
});

router.get("/modify", function (req, res, next) {
  res.render("admin/modify", { title: "admin/modify" });
});

router.post("/modify", function (req, res, next) {
  res.redirect("/admin/list");
});

router.get("/delete", function (req, res, next) {
  res.redirect("/admin/list");
});

module.exports = router;
