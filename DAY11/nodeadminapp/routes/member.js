var express = require("express");
var router = express.Router();

/* GET home page. */

router.get("/list", async (req, res, next) => {
  res.render("member/list", { title: "member/list" });
});

router.get("/create", async (req, res, next) => {
  res.render("member/create", { title: "member/create" });
});

router.post("/create", async (req, res, next) => {
  res.redirect("/member/list");
});

router.get("/modify", async (req, res, next) => {
  res.render("member/modify", { title: "member/modify" });
});

router.post("/modify", async (req, res, next) => {
  res.redirect("/member/list");
});

router.get("/delete", async (req, res, next) => {
  res.redirect("/member/list");
});

module.exports = router;
