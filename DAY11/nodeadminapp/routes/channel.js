var express = require("express");
var router = express.Router();

/* GET home page. */

router.get("/list", function (req, res, next) {
  res.render("channel/list", { title: "channel/list" });
});

router.get("/create", function (req, res, next) {
  res.render("channel/create", { title: "channel/create" });
});

router.post("/create", function (req, res, next) {
  res.redirect("/channel/list");
});

router.get("/modify", function (req, res, next) {
  res.render("channel/modify", { title: "channel/modify" });
});

router.post("/modify", function (req, res, next) {
  res.redirect("/channel/list");
});

router.get("/delete", function (req, res, next) {
  res.redirect("/channel/list");
});

module.exports = router;
