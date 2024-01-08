//modify할 때 쓰이는 함수
//modify에서 선언하면, route주소로 접근할때마다 함수가 재선언되니까 전역으로 선언함.
//밑에서 다시 설명.
const mergeByKey = (baseObj, otherObj) => {
  return Object.keys(baseObj).reduce((result, key) => {
    result[key] = otherObj[key];
    return result;
  }, baseObj);
};

//channel_id : 채널이름
//매칭 오브젝트
var channel_id_value_obj = {
  "": "전체",
  1: "연구소채널",
  2: "모름캠프채널",
  3: "삼성채널",
  4: "구글채널",
  5: "카카오채널",
  6: "라이엇채널",
};

var msg_type_code_value_obj = {
  "": "전체",
  0: "퇴장",
  1: "입장",
  3: "일반메세지",
  4: "파일메세지",
};
module.exports = { mergeByKey, channel_id_value_obj, msg_type_code_value_obj };
