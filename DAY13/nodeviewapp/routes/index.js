var express = require("express");
var router = express.Router();

/* GET home page. */
router.use(function (req, res, next) {
  console.log("1");
  next();
  console.log("1-1");
});

router.use(function (req, res, next) {
  console.log("2");
  next();
  console.log("2-2");
});
router.get("/", function (req, res, next) {
  console.log("get test1");
  res.render("index", { title: "Express" });
  console.log("get test1 after render");
});

router.get("/login", async (req, res, next) => {
  console.log("get login test1");
  //res.render("login.ejs");
  res.send({ hi: 1 });
  console.log("get login test1 after render");
});
module.exports = router;
