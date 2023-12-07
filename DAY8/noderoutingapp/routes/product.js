var express = require("express");
var router = express.Router();

router.get("/list", async (req, res) => {
  res.render("product/list");
});

//product/detail?pid=1&pname=lg노트북
router.get("/detail", async (req, res) => {
  var productID = req.query.pid;
  var productName = req.query.pname;

  res.render("product/detail", { productID, productName });
});
module.exports = router;
