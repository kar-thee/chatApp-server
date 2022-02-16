const jwt = require("jsonwebtoken");

const signToken = (payLoad) => {
  const token = jwt.sign(payLoad, process.env.TOKENSECRET);
  return token;
};
const verifyToken = (token) => {
  const payLoad = jwt.verify(token, process.env.TOKENSECRET);
  return payLoad;
};

module.exports = { signToken, verifyToken };
