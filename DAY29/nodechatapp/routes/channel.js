const express = require("express");
const router = express.Router();
const { tokenAuthChecking } = require("./apiMiddleware");
/* GET home page. */
router.get("/", async (req, res, next) => {
  console.log("chat start!!!!");
  res.render("chat/index", { layout: "layout/chatLayout" });
});

router.get("/verify", tokenAuthChecking, async (req, res, next) => {
  console.log("apiResult locals: ", res.locals.apiResult);
  res.json({ code: "200", message: "Chat started" });
});
module.exports = router;
