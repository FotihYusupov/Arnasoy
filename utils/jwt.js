const jwt = require("jsonwebtoken");

exports.sign = (payload) => {
  try {
    const token = jwt.sign({ payload }, process.env.SECRET_KEY, {
      expiresIn: "120h",
    });
    return token;
  } catch (err) {
    return "Error"
  }
};

exports.verify = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY).payload;
  } catch (err) {
    return "Error"
  }
}
