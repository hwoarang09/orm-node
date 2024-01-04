var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express TTTT" });
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "login get" });
});

router.post("/login", function (req, res, next) {
  res.render("login", { title: "login post" });
});
module.exports = router;
