//socket.io 팩키지 참조
const SocketIO = require("socket.io");
const redis = require("socket.io-redis");
//socket.js모듈 기능정의
module.exports = (server) => {
  // const io = SocketIO(server, { path: "/socket.io" });

  //cors이슈 처리적용한 io객체
  const io = SocketIO(server, {
    path: "/socket.io",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.adapter(redis({ host: "127.0.0.1", port: "6379" }));
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
