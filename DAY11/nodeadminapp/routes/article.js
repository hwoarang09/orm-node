var express = require("express");
var router = express.Router();

/* GET home page. */

router.get("/list", function (req, res, next) {
  res.render("article/list", { title: "article/list" });
});

router.get("/create", function (req, res, next) {
  res.render("article/create", { title: "article/create" });
});

router.post("/create", function (req, res, next) {
  res.redirect("/article/list");
});

router.get("/modify", function (req, res, next) {
  res.render("article/modify", { title: "article/modify" });
});

router.post("/modify", function (req, res, next) {
  res.redirect("/article/list");
});

router.get("/delete", function (req, res, next) {
  res.redirect("/article/list");
});

module.exports = router;
