var express = require("express");
var router = express.Router();

/* GET home page. */

router.get("/list", async (req, res, next) => {
  res.render("message/list", { title: "message/list" });
});

router.get("/create", async (req, res, next) => {
  res.render("message/create", { title: "message/create" });
});

router.post("/create", async (req, res, next) => {
  res.redirect("/message/list");
});

router.get("/modify", async (req, res, next) => {
  res.render("message/modify", { title: "message/modify" });
});

router.post("/modify", async (req, res, next) => {
  res.redirect("/message/list");
});

router.get("/delete", async (req, res, next) => {
  res.redirect("/message/list");
});

module.exports = router;
