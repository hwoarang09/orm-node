const express = require('express');
const router = express.Router();
const Member = require('../schemas/member');

// router.get('/', async (req, res) => {
//   res.render('member/member');
// });

router.get('/list', async (req, res) => {
  const user_list = await Member.find({});
  res.render('member/list', { user_list });
});

router.get('/create', async (req, res) => {
  res.render('member/create');
});

router.post('/create', async (req, res) => {
  var email = req.body.email;
  var member_password = req.body.member_password;
  var name = req.body.name;
  var profile_img_path = req.body.profile_img_path;
  var telephone = req.body.telephone;
  var use_state_code = req.body.use_state_code;
  var birth_date = req.body.birth_date;
  var reg_date = req.body.reg_date;

  var user = {
    email,
    member_password,
    name,
    profile_img_path,
    telephone,
    entry_type_code: 0,
    use_state_code,
    birth_date,
    reg_date,
    reg_member_id: 1
  };

  await Member.create(user);

  res.redirect('/member/list');
});

router.get('/modify/:id', async (req, res) => {
  const memberIdx = req.params.id;
  const user_list = await Member.find({ member_id: memberIdx });
  const user = user_list[0];

  res.render('member/modify', { user });
});

router.post('/modify/:id', async (req, res) => {
  const memberIdx = req.params.id;

  var email = req.body.email;
  var member_password = req.body.member_password;
  var name = req.body.name;
  var profile_img_path = req.body.profile_img_path;
  var telephone = req.body.telephone;
  var birth_date = req.body.birth_date;

  var user = {
    email,
    member_password,
    name,
    profile_img_path,
    telephone,
    entry_type_code: 0,
    use_state_code: 1,
    birth_date,
    edit_date: Date.now(),
    edit_member_id: 1
  };

  await Member.updateOne({ member_id: memberIdx }, user);

  res.redirect('/member/list');
});

router.get('/delete', async (req, res) => {
  const memberIdx = req.query.id;
  await Member.deleteOne({member_id:memberIdx});
  res.redirect('list');
});

module.exports = router;
