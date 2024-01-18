//socket.io 팩키지 참조
const SocketIO = require("socket.io");
//socket.js모듈 기능정의
module.exports = (server) => {
  const io = SocketIO(server, { path: "/socket.io" });
  io.on("connection", (socket) => {
    socket.on("broadcast", function (msg) {
      io.emit("receiveAll", msg);
      //socket.broadcast.emit("receive",msg);
    });

    socket.on("test", async (msg) => {
      io.emit("receiveTest", msg);
    });

    socket.on("entry", async ({ channel, nickName }) => {
      socket.join(channel);
      socket.emit("entryok", `${nickName}으로 ${channel}에 입장했습니다.`);
      socket
        .to(channel)
        .emit("entryok", `${nickName}님이 ${channel}에 입장했습니다.`);
    });

    socket.on("groupmessage", async (data) => {
      console.log("hihihi", data.channel, data.nickName, data.message);
      io.to(data.channel).emit("groupmessage", data);
    });
  });
};
