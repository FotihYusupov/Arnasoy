const jwt = require("jsonwebtoken");

exports.sign = (payload) => {
  const token = jwt.sign({ payload }, process.env.SECRET_KEY, {
    expiresIn: "12h",
  });
  return token;
};

exports.verify = (token) => jwt.verify(token, process.env.SECRET_KEY).payload;
