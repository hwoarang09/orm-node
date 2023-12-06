const { odd, even, test } = require("./base1.js");

function checkOddOrEven(num) {
  if (num % 2 === 0) {
    return odd;
  }
  return even;
}

console.log("base2.js에서 함수실행 : ", checkOddOrEven(3));

//module.export로 해서 에러 찾느라 오래걸림....;;;;
module.exports = {
  checkOddOrEven,
};
