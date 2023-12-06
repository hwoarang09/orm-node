const odd = "홀수입니다.";
const even = "짝수입니다.";

function test() {
  console.log("Base1모듈의 test()함수가 호출되었습니다.");
}

console.log("base1.js에서 출력중");
//이게 정석
module.exports = {
  odd,
  even,
  test,
};

//근데 이렇게도 될 거 같음
// module.exports = {
//   odd_var: odd,
//   even_var: even,
//   test_function: test,
// };
