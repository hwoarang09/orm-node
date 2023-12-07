//계산함수1
function fnPlus(a, b) {
  let c = a + b;
  return c;
}

//계산결과를 터미널에 출력해주는 로깅함수
function logging(result) {
  console.log(`계산 결과값은 ${result} 입니다.`);
}

//계산함수 호출하기
var result = fnPlus(10, 20);
console.log("함수반환값:", result);

function fnPlus1(a, b, callBack) {
  let c = a + b;
  callBack(c);
  return c;
}

var result1 = fnPlus1(3, 4, logging);
var result2 = fnPlus1(4, 5, function (result) {
  var totla = 3000 + result;
  console.log("totla는 ${totla}");
});
//이게 뭔가 그거랑 비슷함
//router.get('/entry', function(res, req) {
//console.log('hi')
//})
//이거랑 모양이 거의 비슷함. 인자 넣고 뒤에 콜백함수 넣기.
//get이라는 메소드가 인자 받고, 그 다음 뒤에 또 인자로 콜백함수를 받는거.

//객체지향 프로그래밍
//일반화: 실체의 공통 속성/긴으을 일반화
// 추상화, 상속, 다형성, 캡슐화
