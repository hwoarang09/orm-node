const express = require("express");
const router = express.Router();
var db = require("../models/index");
var Op = db.Sequelize.Op;
const bcrypt = require("bcryptjs");
const aes = require("mysql-aes");

/* GET home page. */

router.get("/", async (req, res, next) => {
  res.render("login");
});

router.post("/", async (req, res) => {
  try {
    const { email, member_password } = req.body;
    email = aes.decrypt(email, process.env.MYSQL_AES_KEY);

    const getMember = await db.Member.findOne({ where: { email } });
    let passwordResult = await bcrypt.compare(
      member_password,
      getMember.admin_password
    );
    if (getMember && passwordResult) {
      res.redirect("/chat");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/entry", async (req, res, next) => {
  res.render("entry");
});

router.post("/entry", async (req, res) => {
  const { email, member_password, name, profile_img_path, telephone } =
    req.body;
  member_password = await bcrypt.hash(member_password, 12);
  email = await aes.encrypt(email, process.env.MYSQL_AES_KEY);
  telephone = await aes.encrypt(telephone, process.env.MYSQL_AES_KEY);
  const newMember = {
    email,
    member_password,
    name,
    profile_img_path,
    telephone,
    entry_type_code: 1,
    use_state_code: 1,
    reg_member_id: 1,
    reg_date: Date.now(),
  };

  try {
    await db.Member.create(newMember);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

router.get("/find", async (req, res, next) => {
  res.render("find");
});

router.post("/find", async (req, res) => {
  res.redirect("login");
});

module.exports = router;
