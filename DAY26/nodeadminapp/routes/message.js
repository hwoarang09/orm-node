const express = require("express");
const router = express.Router();

const path = require("path");
const app = express();

// 정적 파일을 제공할 디렉토리 설정

//각종 라이브러리
var moment = require("moment");
const ChannelMessage = require("../schemas/channelMessage");
const Swal = require("sweetalert2");

//개인용 util
const {
  mergeByKey,
  channel_id_value_obj,
  msg_type_code_value_obj,
} = require("./utils/utiles");

//searchOption 초기값으로 ""를 줘서
//list.ejs에서는 ""가 들어오면 select메뉴는 전체를 가리키도록 함.
router.get("/list", async (req, res) => {
  var searchOption = {
    channel_id: "",
    nick_name: "",
    msg_type_code: "",
  };

  //모든 값 다 찾음
  //수업시간에 pagination라이브러리 배웟는데, 게시글이 많으면 한번에 다 가져오니까
  //성능이 안 좋음. 나중에 리액트같은 거 할 때, 필요한 만큼만 가져오는 식으로 구현할 거라 깊이 안 함
  const msgs = await ChannelMessage.find({});

  res.render("message/list", {
    msgs,
    searchOption,
    moment,
    channel_id_value_obj,
    msg_type_code_value_obj,
  });
});

//조회코드
router.post("/list", async (req, res) => {
  var { channel_id, nick_name, msg_type_code } = req.body;

  var searchOption = {
    channel_id,
    nick_name,
    msg_type_code,
  };

  //reduce는 array를 순환하면서 하나의 무언가로 바꾸는 기능
  // [1,2,3,4]를 reduce를 통해 10으로 return할수도 있고
  // {channel_id : '삼성', nick_name : '성원', msg_type_code : ""}를
  //중간에 if문 걸어서 ""인 경우는 제외한 object를 리턴하는 것도 가능.
  //{channel_id : '삼성', nick_name : '성원'}
  //map, filter를 array를 리턴하지만,
  //reduce는 리턴값이 자유로움.

  //이번 경우에는 searchOption이라는 객체에서
  //key array를 통해 접근해서
  //다른 -객체-를 리턴해야하니까 reduce를 사용함.

  //reduce는 Array.reduce( ()=> {}, {})형식임.
  //첫번째 인자는 원소마다 적용할 콜백함수,
  //두번째 인자는 리턴값의 초기설정값.

  const filteredObject = Object.keys(searchOption).reduce((acc, key) => {
    if (searchOption[key] !== "") {
      acc[key] = searchOption[key];
    }
    return acc;
  }, {});

  //filteredObject가 {}이므로, .find({filteredObject}) 이런 식으로 안씀
  const msgs = await ChannelMessage.find(filteredObject);

  res.render("message/list", {
    msgs,
    searchOption,
    moment,
    channel_id_value_obj,
    msg_type_code_value_obj,
  });
});

//신규등록 첫 화면
router.get("/create", async (req, res) => {
  res.render("message/create");
});

//신규등록 확인 누를 때
router.post("/create", async (req, res) => {
  var msg = {
    channel_id: req.body.channel_id,
    member_id: req.body.member_id,
    nick_name: req.body.nick_name,
    msg_type_code: req.body.msg_type_code,
    connection_id: req.body.connection_id,
    message: req.body.message,
    ip_address: req.body.ip_address,
    top_channel_msg_id: 999,
    msg_state_code: 1,
    msg_date: Date.now(),
    edit_date: Date.now(),
    reg_date: Date.now(),
  };
  await ChannelMessage.create(msg);
  console.log("msg create : ", msg);
  res.redirect("/message/list");
});

//list에서 #id눌러서 수정화면 띄웠을 때
router.get("/modify/:channel_msg_id", async (req, res) => {
  const channel_msg_id = req.params.channel_msg_id;

  //효원님이 이런 식으로 에러처리하는 거 같은데 이게 좋은듯
  try {
    const msg = await ChannelMessage.findOne({ channel_msg_id });
    if (msg === null)
      res.status(404).send("no channel_msg_id : " + channel_msg_id);
    else
      res.render("message/modify", {
        msg,
        channel_id_value_obj,
        msg_type_code_value_obj,
      });
  } catch (err) {
    //if (channel_msg_id === undefined || channel_msg_id === "")
    //res.send("channel_msg_id need! " + err);
    //else res.send("error!!! : " + err);
    //이런 식으로 에러처리했었는데, try문+router에서 에러처리하니까 필요없어서 수정

    //에러케이스
    //1. http://127.0.0.1:3001/message/modify/ㅁ
    //-> catch문에서 잡힘
    //2. http://127.0.0.1:3001/message/modify/
    //-> 라우터에서 잡힘
    //3. http://127.0.0.1:3001/message/modify/235023523
    //-> try문에서 msg값이 null처리

    res.status(400).send("error!!! : " + err);
  }
});

router.post("/modify/:channel_msg_id", async (req, res) => {
  var channel_msg_id = req.params.channel_msg_id;
  try {
    const msg = await ChannelMessage.findOne({ channel_msg_id });
    //msg를 그냥 넣으면 동작안함.
    //Object.keys(msg)에서는 [ '$__', '$isNew', '_doc' ] 이런 게 출력됨.
    //for in이랑 다름.
    //자세한 건 따로 정리

    //원본인 msg를 result의 초기값으로 설정.
    //msg의 key값을 순회하면서 해당 key값의 value를
    //req.body에서 가져와서 덮어씌움.

    // const mergeByKey = (baseObj, otherObj) => {
    //   return Object.keys(baseObj).reduce((result, key) => {
    //     result[key] = otherObj[key];
    //     return result;
    //   }, baseObj);
    // };
    var mergedObject = mergeByKey(msg.toJSON(), req.body);
    //수정일시만 따로 설정
    mergedObject.edit_date = Date.now();
    await ChannelMessage.updateOne({ channel_msg_id }, mergedObject);
    res.redirect("/message/list");
  } catch (err) {
    res.status(400).send("error!!! : " + err);
  }
});

router.get("/delete", async (req, res) => {
  res.redirect("list");
});

//아래의 에러처리 코드는 무조건 router정의가 다 끝난 최하단에 위치해야 함.
//위에서 정의하지 않은 라우터에 대한 모든 요청에 대해서
//Error 객체를 생성하는 아래의 미들웨어를 실행한다.
router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

//위에서 받은 Error객체를 통해 화면에 처리하는 미들웨어
router.use((err, req, res, next) => {
  //console.log(err);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

module.exports = router;
