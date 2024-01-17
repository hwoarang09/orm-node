var express = require('express');
var router = express.Router();

var db = require('../models/index');

//member조회
router.get('/list', async (req, res, next) => {

  var searchOption = {
    email: "",
    name: "",
    use_state_code: "0"
  }

  var member_list = await db.Member.findAll(
    {
      attributes: ['member_id', 'email', 'name', 'telephone',
        'birth_date', 'use_state_code', 'reg_date', 'edit_date']
    }
  )

  res.render('member/list', { member_list, searchOption });
});

router.post('/list', async (req, res, next) => {

  var email = req.body.email;
  var name = req.body.name;
  var use_state_code = req.body.use_state_code;

  var searchOption = {
    email,
    name,
    use_state_code
  }

  var member_list = await db.Member.findAll({
    where: {
      email: email, name: name, use_state_code: use_state_code
    }
  })

  console.log("멤버리스트:", member_list);

  res.render('member/list', { member_list, searchOption });
});


//member생성
router.get('/create', async (req, res, next) => {
  res.render('member/create');
});

router.post('/create', async (req, res, next) => {

  var email = req.body.email;
  var member_password = req.body.member_password;
  var name = req.body.name;
  var profile_img_path = req.body.profile_img_path;
  var telephone = req.body.telephone;
  var entry_type_code = req.body.entry_type_code;
  var birth_date = req.body.birth_date;


  var member = {
    email,
    member_password,
    name,
    profile_img_path,
    telephone,
    entry_type_code,
    use_state_code: 1,
    birth_date,
    reg_date: Date.now(),
    reg_member_id: 881
  };

  // console.log('member : ', member);
  await db.Member.create(member);

  res.redirect('/member/list');
});


//member삭제
router.get('/delete', async (req, res, next) => {

  var member_id = req.query.member_id;

  // console.log("멤버아이디:", member_id);

  await db.Member.destroy({ where: { member_id: member_id } });

  res.redirect('/member/list');
});


//member수정
router.get('/modify/:member_id', async (req, res, next) => {

  var member_id = req.params.member_id;

  var member = await db.Member.findOne({ where: { member_id: member_id } });

  res.render('member/modify', { member });
});

router.post('/modify/:member_id', async (req, res, next) => {

  var member_id = req.params.member_id;


  var email = req.body.email;
  var member_password = req.body.member_password;
  var name = req.body.name;
  var profile_img_path = req.body.profile_img_path;
  var telephone = req.body.telephone;
  var entry_type_code = req.body.entry_type_code;
  var birth_date = req.body.birth_date;


  var member = {
    email,
    member_password,
    name,
    profile_img_path,
    telephone,
    entry_type_code,
    use_state_code: 1,
    birth_date,
    reg_date: Date.now(),
    reg_member_id: 881,
    edit_date: Date.now(),
    edit_member_id: 991
  };

  await db.Member.update(member, { where: { member_id: member_id } });

  res.redirect('/member/list');
});



module.exports = router;
