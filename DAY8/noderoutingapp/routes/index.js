var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//콜백함수 rouget
router.get("/main", async (req, res) => {
  res.render("index.ejs", { title: "인덱스페이지" });
});

/*
  -기능 : 
*/
router.get("/products", async (req, res) => {
  var products = [
    { pid: 1, pname: "lg노트북", price: 5000, stock: 4 },
    { pid: 2, pname: "삼성오트북", price: 6000, stock: 2 },
  ];
  //res.메소드에  render, json, redirect 사용해봤음
  //gpt검색해보니까 send, status등등 더 있음.
  res.json(products);
});
module.exports = router;
