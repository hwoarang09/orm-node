var express = require("express");
var router = express.Router();

/* GET home page. */

router.get("/list", function (req, res, next) {
  res.render("member/list", { title: "member/list" });
});

router.get("/create", function (req, res, next) {
  res.render("member/create", { title: "member/create" });
});

router.post("/create", function (req, res, next) {
  res.redirect("/member/list");
});

router.get("/modify", function (req, res, next) {
  res.render("member/modify", { title: "member/modify" });
});

router.post("/modify", function (req, res, next) {
  res.redirect("/member/list");
});

router.get("/delete", function (req, res, next) {
  res.redirect("/member/list");
});

module.exports = router;
