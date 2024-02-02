//socket.io 팩키지 참조

const redis = require("socket.io-redis");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const moment = require("moment");
let db = require("./models/index");
const SocketIO = require("socket.io");
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
    //사용자 전역변수 정의
    //소켓Req객체
    const req = socket.request;

    //접속 클라이언트 IP주소
    const userIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress; //사용자IP
    const socketId = socket.id;

    //웹브라우저와 서버소켓이 끊어질떄마다 자동으로 발생하는 이벤트
    //사용자가 채팅중에 웹브라우저를 닫거나/탭을 닫거나 일시적 네트워크 장애가 발생해 웹소켓이 끊기는경우
    //서버소켓에서 자동 소켓 끊김 감지 기능제공
    socket.on("disconnect", async () => {
      //개발자 정의 현재 접속자 연결 끊김 처리함수
      await UserConnectionOut();

      // 소켓 끊김시 서버측 자원정리 기능제공
      clearInterval(socket.interval);
    });

    //소켓통신 에러 감지 이벤트 핸들러
    socket.on("error", async (error) => {
      console.log("서버 소켓 에러발생 이벤트 감지기....");
    });

    socket.on("broadcast", function (msg) {
      io.emit("receiveAll", msg);
    });

    socket.on("test", async (data) => {
      console.log("test!!", data);
      io.emit("receiveTest", data);
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

    //채팅방 입장하기
    socket.on("entryChannel", async ({ channel }) => {
      try {
        var currentUser = jwt.verify(channel.token, process.env.JWT_SECRET);

        //step1 : 채널유형별 채널정보 생성 또는 조회하기
        //일대일채널은 생성, 그룹채널은 조회

        var channelData = {};

        if (channel.channelType == 1) {
          //일대일 채널명은 2명의 member_id로 구현함.
          //ex) 11-25 11번과 25번의 일대일 채팅방
          var channelName =
            channel.targetMemberId < currentUser.member_id
              ? `${channel.targetMemberId}-${currentUser.member_id}`
              : `${currentUser.member_id}-${channel.targetMemberId}`;
          //일대일 챈러 존재여부 체크 후 없으면 생성

          channelData = await db.Channel.findOne({
            where: { channel_name: channelName, category_code: 1 },
          });

          //동일한 일대일 챈러정보가 존재하지 않으면
          if (channelData == null) {
            var channelInfo = {
              community_id: 1,
              category_code: channel.channelType,
              channel_name: channelName,
              channel_img_path: "",
              user_limit: 2,
              channel_state_code: 1,
              reg_date: Date.now(),
              reg_member_id: currentUser.member_id,
              edit_date: Date.now(),
            };
            //일대일 채널 생성
            var registedChannel = await db.Channel.create(channelInfo);
            channelData = registedChannel;
            //채널 구성원 정보 등록
            var currentMember = {
              channel_id: registedChannel.channel_id,
              member_id: currentUser.member_id,
              nick_name: currentUser.name,
              member_type_code: 1,
              active_state_code: 0,
              connection_id: "",
              ip_address: "",
              edit_date: Date.now(),
              edit_member_id: currentUser.member_id,
              last_contact_date: Date.now(),
            };
            await db.ChannelMember.create(currentMember);
            var targetMember = {
              channel_id: registedChannel.channel_id,
              member_id: channel.targetMemberId,
              nick_name: channel.targetNickName,
              member_type_code: 0,
              active_state_code: 0,
              connection_id: "",
              ip_address: "",
              edit_date: Date.now(),
              edit_member_id: currentUser.member_id,
              last_contact_date: Date.now(),
            };
            var result = await db.ChannelMember.create(targetMember);
          }
        } else {
          //그룹챈러 정보조회
          console.log("else");
        }
        //step2 : 현재 채팅방 접속자 정보 조회 및 정보 업데이트

        console.log("step2 시작");
        var updateMember = {
          active_state_code: 1,
          last_contact_date: Date.now(),
          connection_id: socketId,
          ip_address: userIP,
        };
        var updateResult = await db.ChannelMember.update(updateMember, {
          where: {
            channel_id: channelData.channel_id,
            member_id: currentUser.member_id,
          },
        });

        var searchResult = await db.ChannelMember.findAll({});
        console.log("searchResult : ", searchResult);
        console.log("channelData.channel_id : ", channelData.channel_id);
        console.log("member_id : ", currentUser.member_id);
        console.log("updateResult : ", updateResult);

        //step3 : 채널 조인(채팅방 입장 처리하기)
        socket.join(channelData.channel_id);

        //step4 : 채널 조인결과 메시지 발송
        socket.emit(
          "entryOk",
          `${currentUser.name}으로 ${channelData.channelName}에 입장했습니다.`,
          currentUser.name,
          channelData
        );
        socket
          .to(channelData.channelId)
          .emit(
            "entryok",
            `${currentUser.name}님이 ${channelData.channelName}에 입장했습니다.`,
            currentUser.name,
            channelData
          );

        await ChattingMsgLogging(
          channelData.channelId,
          currentUser.memberId,
          currentUser.name,
          1,
          `${currentUser.name}님이 ${channelData.channelName}에 입장했습니다.`
        );
      } catch (err) {
        console.log("err : ", err);
      }
    });

    //채팅방별 메세지 수신 발신 처리 기능
    socket.on("channelMsg", async (data) => {
      var sendDate = moment(Date.now()).format("HH:mm");
      //해당 채널의 모든 사용자들에게 메세지 발송하기
      io.to(data.channelId).emit("receiveChannelMsg", { ...data, sendDate });

      await ChattingMsgLogging(
        data.channelId,
        data.memberId,
        data.nickName,
        2,
        data.message
      );
    });
    async function ChattingMsgLogging(
      channelId,
      memberId,
      nickName,
      msgTypeCode,
      msg
    ) {
      var msg = {
        channel_id: channelId,
        member_id: memberId,
        nick_name: nickName,
        msg_type_code: msgTypeCode,
        connection_id: socketId,
        ip_address: userIP,
        message: msg,
        msg_state_code: 1,
        msg_date: Date.now(),
      };

      await db.ChannelMsg.create(msg);
    }

    //사용자 나가기 정보 처리
    async function UserConnectionOut() {
      //현재 접속이 끊어지는 사용자의 Connectionid기반으로 현재 사용자 정보조회

      var member = await db.ChannelMember.findOne({
        where: { connection_id: socketId },
      });

      if (member != null) {
        //사용자 연결 끊김 정보 수정반영하기
        var updateMember = {
          active_state_code: 0,
          last_out_date: Date.now(),
          connection_id: socketId,
          ip_address: userIP,
        };

        await db.ChannelMember.update(updateMember, {
          where: { connection_id: socketId },
        });

        //채팅방 퇴장 로그 기록 하기
        await ChattingMsgLogging(
          member.channel_id,
          member.member_id,
          member.nick_name,
          0,
          `${member.nick_name}님이 채팅방을 퇴장했습니다`
        );
      }
    }
  });
};
