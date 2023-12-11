exports.checkParams = (req, res, next) => {
  if (req.params.id === undefined) {
    console.log("id가 없다");
  } else {
    console.log("id가 있다. ", req.params.id);
  }
  next();
};

exports.checkQueryKey = (req, res, next) => {
  if (req.query.category === undefined) {
    console.log("category가 전달안됨");
  } else {
    console.log("category : ", req.query.category);
  }
  next();
};
