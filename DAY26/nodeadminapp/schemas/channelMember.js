const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const { Schema } = mongoose;

const channel_member = new Schema({
  channel_id: {
    type: Number,
    required: true,
  },
  member_id: {
    type: Number,
    required: true,
  },
  nick_name: {
    type: String,
    required: true,
  },
  member_type_code: {
    type: Number,
    required: true,
  },
  active_state_code: {
    type: Number,
    required: true,
  },
  last_contact_date: {
    type: Date,
    required: true,
  },
  last_out_date: {
    type: Date,
    required: false,
  },
  connection_id: {
    type: String,
    required: true,
  },
  ip_address: {
    type: String,
    required: true,
  },
  edit_member_id: {
    type: Number,
    required: false,
  },
  edit_date: {
    type: Date,
    default: Date.now,
  },
});

//channel_member.plugin(AutoIncrement, { inc_field: "cm_id" }); //article_id는 1,2,3,4..

module.exports = mongoose.model("ChannelMember", channel_member);
