//콜백함수의 한계: 콜백지옥
var fnHell = function () {
  console.log("로직1");
  setTimeout(function () {
    console.log("로직2");
    setTimeout(function () {
      console.log("로직3");
      setTimeout(function () {
        console.log("로직4");
      }, 1000);
    }, 1000);
  }, 1000);

  //이런 식으로하면 로직2, 로직3 중 누가 먼저 끝날지 애매해진다함.
  // setTimeout(function() {
  //   console.log('로직3');
  // }, 1000)
};
