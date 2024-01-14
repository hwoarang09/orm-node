const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const { Schema } = mongoose;

const channel_message = new Schema({
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
  msg_type_code: {
    type: Number,
    required: true,
  },

  connection_id: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  ip_address: {
    type: String,
    required: true,
  },
  top_channel_msg_id: {
    type: Number,
    required: true,
  },
  msg_state_code: {
    type: Number,
    required: true,
  },
  msg_date: {
    type: Date,
    default: Date.now,
  },
  edit_date: {
    type: Date,
    default: Date.now,
  },
  del_date: {
    type: Date,
    default: Date.now,
  },
});

channel_message.plugin(AutoIncrement, { inc_field: "channel_msg_id" }); //article_id는 1,2,3,4..

module.exports = mongoose.model("ChannelMessage", channel_message);
