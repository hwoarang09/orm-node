var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log("index");
  res.render("index", { title: "Express" });
});

router.get("/test", function (req, res, next) {
  res.render("index", { title: "Express index test" });
});

router.get("/login", function (req, res, next) {
  res.render("login", { layout: false, title: "login get" });
});

router.post("/login", function (req, res, next) {
  res.redirect("/");
});
module.exports = router;
