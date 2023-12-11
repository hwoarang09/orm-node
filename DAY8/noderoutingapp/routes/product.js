var express = require("express");
var router = express.Router();
const path = require("path");

router.get("/list", async (req, res) => {
  res.render("product/list");
});

//product/detail?pid=1&pname=lg노트북
router.get("/detail", async (req, res) => {
  var productID = req.query.pid;
  var productName = req.query.pname;

  res.render("product/detail", { productID, productName });
});

//res.send() 만능 메소드 사용해보기
router.get("/detail/sendall", async (req, res) => {
  //res.send("안녕하세요");
  //res.send({ uid: "eddy", username: "창훈" });

  //이미지는 이렇게 안보냄
  //res.send("Daily_ORMDAY8\noderoutingapppublicimages\0401_t1_geng_2set.png");

  const imagePath = "../public/images/0401_t1_geng_2set.png";

  res.sendFile(path.join(__dirname, imagePath));
  //res.sendFile(imagePath);
});

//와일드 카드 이용시 주의사항: 동일한 URL 호출주소화 호출방식(get)의 라우팅 메소드가 존재하는 경우
//와일드카드 방식이 먼저 호출되고 다른 라우팅 메소드는 호출이 무시된다
//호출주소체계 : /product/detail/sample
//호출방식 get

// /product/detail/sample로 호출해서 productID에 100을 넣으니까
//100이 화면에 나와야 하는데, productID가 sample로 나옴.
//오ㅒ??
//아래꺼 방식이 아니라 위에꺼 호출됨.
router.get("/detail/sample", async (req, res) => {
  res.render("product/detail", { productID: 100, productName: "노트북2" });
});

//와이들카드 방식
//product/detail/1
//이런 애들은 위에껄아 겹치면 이상해지니까 맨 아래에 위치해야 함.
router.get("/detail/:pid", async (req, res) => {
  var productID = req.params.pid;

  res.render("product/detail", { productID, productName: "노트북" });
});

///product/detail/1/LG노트북/6000
//이런 식으로 오는 경우 해당 값들 추출하면서 라우팅 구현

router.get("/detail/:pid/:productName/:price", async (req, res) => {
  var productID = req.params.pid;
  var productName = req.params.productName;
  var price = req.params.price;
  res.render("product/detail", { productID, productName, price });
});

module.exports = router;
