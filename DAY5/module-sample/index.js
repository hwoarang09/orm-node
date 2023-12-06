const { odd, even, test } = require("./base1.js");
const { checkOddOrEven } = require("./base2.js");

console.log("-------------index.js시작-------------");

console.log(odd, even);
test();
console.log("--------------------------");
console.log(checkOddOrEven(3));
console.log(checkOddOrEven(4));

// const { odd_var, even_var, test_function } = require("./base1.js");
// console.log("index.js에서 _붙인 애들");
// console.log(odd_var, even_var);
// test_function();
