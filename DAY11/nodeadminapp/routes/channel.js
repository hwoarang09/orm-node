var express = require("express");
var router = express.Router();

/* GET home page. */

router.get("/list", async (req, res, next) => {
  res.render("channel/list", { title: "channel/list" });
});

router.get("/create", async (req, res, next) => {
  res.render("channel/create", { title: "channel/create" });
});

router.post("/create", async (req, res, next) => {
  res.redirect("/channel/list");
});

router.get("/modify", async (req, res, next) => {
  res.render("channel/modify", { title: "channel/modify" });
});

router.post("/modify", async (req, res, next) => {
  res.redirect("/channel/list");
});

router.get("/delete", async (req, res, next) => {
  res.redirect("/channel/list");
});

module.exports = router;
