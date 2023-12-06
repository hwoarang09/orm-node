var express = require("express");
var router = express.Router();

router.get("/join", function (req, res) {
  res.render("member/join.ejs", { message: "hihihi" });
});
router.get("/entry", function (req, res) {
  res.render("member/entry.ejs", { message: "hihihi" });
});

router.post("/entry", function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  console.log(req.body);
  console.log(`entry!!!!email ${email}  password ${password}`);

  if (email !== "" && password !== "") res.redirect("/auth/login");
});

module.exports = router;
