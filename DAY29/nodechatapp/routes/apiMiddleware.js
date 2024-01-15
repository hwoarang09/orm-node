const jwt = require("jsonwebtoken");

exports.tokenAuthChecking = async (req, res, next) => {
  var apiResult = {
    code: 400,
    data: null,
    msg: "!!.",
  };

  try {
    var token = req.headers.authorization.split("Bearer ")[1];

    var tokenJsonData = await jwt.verify(token, process.env.JWT_SECRET);

    if (tokenJsonData != null) next();
  } catch (err) {
    if (req.headers.authorization == undefined) {
      apiResult = {
        code: 400,
        data: null,
        msg: "유효하지 않은 사용자 인증토큰.",
      };
      return res.json(apiResult);
    }
  }
};
