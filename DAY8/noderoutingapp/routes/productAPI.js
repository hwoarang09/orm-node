var express = require("express");
var router = express.Router();

router.get("/list", async (req, res) => {
  var products = [
    { pid: 1, pname: "lg노트북", price: 5000, stock: 4 },
    { pid: 2, pname: "삼성오트북", price: 6000, stock: 2 },
  ];
  //res.메소드에  render, json, redirect 사용해봤음
  //gpt검색해보니까 send, status등등 더 있음.
  res.json(products);
});

//url을 통해 get방식으로 서버에 데이터를 전달하는 방법 2가지
//case1 쿼리스트링방식으로 주소를 통해 서버로 데이터를 전달
//case2 url주소에 직접 데이터를 넣어서 주소체계를 만들어 데이터를 전달하는 방식
//SEO최적화를 위해 url처리 잘해야함.
module.exports = router;
