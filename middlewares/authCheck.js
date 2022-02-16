const { verifyToken } = require("../util/tokenHelper");

const authCheckMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization) {
      return res
        .status(404)
        .send({ msg: "No auth headers available", type: "error" });
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      return res
        .status(404)
        .send({ msg: "No auth token present", type: "error" });
    }

    const payLoad = verifyToken(token);

    if (!payLoad || typeof payLoad === String) {
      return res.status(401).send({ msg: "Signin again", type: "error" });
    }
    const userObj = {
      name: payLoad.name,
      email: payLoad.email,
      id: payLoad.id,
    };
    req.userObj = userObj;
    next();
  } catch (err) {
    console.log(err.message, " err");
    return res.status(500).send({ msg: err.message, type: "error" });
  }
};

module.exports = authCheckMiddleware;
