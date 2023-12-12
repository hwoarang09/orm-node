var express = require("express");
var router = express.Router();

/* GET home page. */

router.get("/list", async (req, res, next) => {
  res.render("admin/list", { title: "admin/list" });
});

router.get("/create", async (req, res, next) => {
  res.render("admin/create", { title: "admin/create" });
});

router.post("/create", async (req, res, next) => {
  res.redirect("/admin/list");
});

router.get("/modify", async (req, res, next) => {
  res.render("admin/modify", { title: "admin/modify" });
});

router.post("/modify", async (req, res, next) => {
  res.redirect("/admin/list");
});

router.get("/delete", async (req, res, next) => {
  res.redirect("/admin/list");
});

module.exports = router;
