const mongoose = require("mongoose");

const connect = async function connectToMongoDB() {
  try {
    await mongoose.connect("mongodb://eddy:eddy524640!@localhost:27017/", {
      dbName: "modu_chat",
    });
    console.log("Connected to MongoDB");
    // Your code here
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

require("./channel.js");

module.exports = connect;
