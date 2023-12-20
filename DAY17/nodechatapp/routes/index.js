var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "login" });
});

router.post("/login", function (req, res, next) {
  let id = req.body.id;
  let password = req.body.password;
  console.log(`login post!! id : ${id}   password : ${password}`);
  res.redirect("/chat");
});

router.get("/entry", function (req, res, next) {
  res.render("entry", { title: "entry" });
});

router.post("/entry", function (req, res, next) {
  let id = req.body.id;
  let password = req.body.password;
  console.log(`entry post!! id : ${id}   password : ${password}`);
  res.redirect("/login");
});

router.get("/find", function (req, res, next) {
  res.render("find", { title: "find" });
});

router.post("/find", function (req, res, next) {
  let id = req.body.id;
  let email = req.body.email;
  console.log(`find post!! id : ${id}   email : ${email}`);

  res.redirect("/login");
});
module.exports = router;
