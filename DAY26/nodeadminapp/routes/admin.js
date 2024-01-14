const express = require('express');
const router = express.Router();
const Admin = require('../schemas/admin_member');

router.get('/list', async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.render('admin/list', { admins });
  } catch (error) {}
});

router.post('/list', async (req, res) => {
  const { admin_name, admin_id, used_yn_code } = req.body;

  const searchOption = {
    admin_name,
    admin_id,
    used_yn_code,
  };

  try {
    const admins = await Admin.find({});
    res.render('admin/list', { admins });
  } catch (error) {}
});

router.get('/create', async (req, res) => {
  res.render('admin/create');
});

router.post('/create', async (req, res) => {
  const {
    company_code,
    admin_id,
    admin_password,
    admin_name,
    email,
    telephone,
    used_yn_code,
    reg_member_id,
    reg_date,
  } = req.body;

  const newAdmin = {
    company_code,
    admin_id,
    admin_password,
    admin_name,
    email,
    telephone,
    used_yn_code,
    reg_member_id,
    reg_date,
  };

  try {
    await Admin.create(newAdmin);
  } catch (error) {
    console.log(error);
  }

  res.redirect('list');
});

router.get('/modify/:id', async (req, res) => {
  const selectedAdminMemberId = req.params.id;

  try {
    const selectedAdmin = await Admin.findOne({
      admin_member_id: selectedAdminMemberId,
    });
    res.render('admin/modify', { selectedAdmin });
  } catch (error) {
    console.log(error);
  }
});

router.post('/modify/:id', async (req, res) => {
  const selectedAdminMemberId = req.params.id;
  const {
    company_code,
    admin_id,
    admin_password,
    admin_name,
    email,
    telephone,
    used_yn_code,
    reg_member_id,
    reg_date,
    edit_user,
    edit_date,
    action,
  } = req.body;

  const updateAdmin = {
    company_code,
    admin_id,
    admin_password,
    admin_name,
    email,
    telephone,
    used_yn_code,
    reg_member_id,
    reg_date,
    edit_user,
    edit_date,
  };

  try {
    if (action === 'save') {
      await Admin.updateOne(
        { admin_member_id: selectedAdminMemberId },
        updateAdmin
      );
    } else {
      await Admin.deleteOne({ admin_member_id: selectedAdminMemberId });
    }
  } catch (error) {
    console.log(error);
  }

  res.redirect('/admin/list');
});

module.exports = router;
