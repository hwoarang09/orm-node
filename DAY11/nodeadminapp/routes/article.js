var express = require("express");
var router = express.Router();

/* GET home page. */

router.get("/list", async (req, res, next) => {
  res.render("article/list", { title: "article/list" });
});

router.get("/create", async (req, res, next) => {
  res.render("article/create", { title: "article/create" });
});

router.post("/create", async (req, res, next) => {
  res.redirect("/article/list");
});

router.get("/modify", async (req, res, next) => {
  res.render("article/modify", { title: "article/modify" });
});

router.post("/modify", async (req, res, next) => {
  res.redirect("/article/list");
});

router.get("/delete", async (req, res, next) => {
  res.redirect("/article/list");
});

module.exports = router;
