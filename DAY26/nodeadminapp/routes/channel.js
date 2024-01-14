const express = require('express');
const router = express.Router();
const Channel = require('../schemas/channel');

router.get('/list', async (req, res) => {
  try {
    const channels = await Channel.find({});
    res.render('channel/list', { channels });
  } catch (error) {
    console.log(error);
  }
});
router.get('/create', async (req, res) => {
  res.render('channel/create');
});
router.post('/create', async (req, res) => {
  const {
    community_id,
    category_code,
    channel_name,
    channel_desc,
    channel_img_path,
    channel_state_code,
    reg_date,
    reg_member_id,
    user_limit,
  } = req.body;

  const newChannel = {
    community_id,
    category_code,
    channel_name,
    channel_desc,
    channel_img_path,
    channel_state_code,
    reg_date,
    reg_member_id,
    user_limit,
  };

  try {
    await Channel.create(newChannel);
    res.redirect('/channel/list');
  } catch (error) {
    console.log(`channel POST ${error}`);
  }
});

router.get('/modify/:id', async (req, res) => {
  const selectedChannelId = req.params.id;

  try {
    const selectedChannel = await Channel.findOne({
      channel_member_id: selectedChannelId,
    });
    res.render('channel/modify', { selectedChannel });
  } catch (error) {
    console.log(error);
  }
});

router.post('/modify/:id', async (req, res) => {
  const selectedChannelId = req.params.id;

  const {
    community_id,
    category_code,
    channel_name,
    channel_desc,
    channel_img_path,
    channel_state_code,
    reg_date,
    reg_member_id,
    user_limit,
    edit_date,
    edit_member_id,
    action,
  } = req.body;

  const updateChannel = {
    community_id,
    category_code,
    channel_name,
    channel_desc,
    channel_img_path,
    channel_state_code,
    reg_date,
    reg_member_id,
    user_limit,
    edit_date,
    edit_member_id,
  };

  try {
    if (action === 'save') {
      await Channel.updateOne({ channel_id: selectedChannelId }, updateChannel);
      res.redirect('/channel/list');
    } else {
      await Channel.deleteOne({ channel_id: selectedChannelId });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
