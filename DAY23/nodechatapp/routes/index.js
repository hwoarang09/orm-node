var express = require("express");
var router = express.Router();
var db = require("../models/index");
var Op = db.Sequelize.Op;

/* GET home page. */
//router.get("/", async (req, res) => res.render("login", { layout: true }));
router.get(["/", "/login"], async (req, res) => {
  res.render("login", { layout: true });
});

router.get("/index", async (req, res, next) => {
  res.render("index", { title: "login", layout: false });
});

router.post(["/", "/login"], async (req, res, next) => {
  var searchOption = ({ email, member_password } = req.body);

  var member = await db.Member.findOne({
    attributes: ["email", "member_password"],
    where: {
      email: searchOption.email,
    },
  });
  // member = member.map((arr) => {
  //   return arr.dataValues;
  // });
  console.log("searchOption : ", searchOption);
  console.log("member : ", member);
  res.redirect("/index");
});

router.get("/entry", function (req, res, next) {
  res.render("entry", { title: "entry" });
});

router.post("/entry", function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  console.log(`entry post!! email : ${email}   password : ${password}`);

  res.redirect("/");
});

router.get("/find", function (req, res, next) {
  res.render("find", { title: "find" });
});

router.post("/find", function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  console.log(`find post!! email : ${email}   password : ${password}`);

  res.redirect("/");
});
module.exports = router;
