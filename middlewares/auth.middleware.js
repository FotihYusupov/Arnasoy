const { verify } = require("../utils/jwt");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      const userId = verify(token);
      if (userId) {
        req.headers.userId = userId;
        next();
      } else {
        res.status(401).json({
          message: "Token is not defined",
        });
      }
    }
  } else {
    res.status(401).json({
      message: "Token is not defined",
    });
  }
}

module.exports = authMiddleware;
