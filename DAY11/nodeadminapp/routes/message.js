var express = require("express");
var router = express.Router();

/* GET home page. */

router.get("/list", function (req, res, next) {
  res.render("message/list", { title: "message/list" });
});

router.get("/create", function (req, res, next) {
  res.render("message/create", { title: "message/create" });
});

router.post("/create", function (req, res, next) {
  res.redirect("/message/list");
});

router.get("/modify", function (req, res, next) {
  res.render("message/modify", { title: "message/modify" });
});

router.post("/modify", function (req, res, next) {
  res.redirect("/message/list");
});

router.get("/delete", function (req, res, next) {
  res.redirect("/message/list");
});

module.exports = router;
