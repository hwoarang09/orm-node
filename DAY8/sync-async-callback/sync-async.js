function fn1() {
  console.log("============fn1");
}

function fn2(cb) {
  console.log("==============fn2-1");
  setTimeout(function () {
    //console.log("=========>cb");
    cb();
  }, 2000);
}

function fn3() {
  console.log("============fn3");
}

function cb() {
  console.log("============cb");
}

fn1();
fn2(cb);
fn3();
