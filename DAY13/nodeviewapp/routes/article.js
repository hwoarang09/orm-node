var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/list", function (req, res, next) {
  res.render("article/list");
});

router.get("/create", function (req, res, next) {
  res.render("article/create");
});
router.post("/create", function (req, res, next) {
  res.redirect("/article/list");
});

router.get("/delete", async (req, res, next) => {
  var articleIdx = req.query.aid;
  res.render("article/list");
});

router.get("/modify/:aid", async (req, res, next) => {
  var articleIdx = req.params.aid;

  res.render("article/modify");
});
router.post("/modify/:aid", function (req, res, next) {
  var articleIdx = req.params.aid;

  res.redirect("/article/list");
});

module.exports = router;
