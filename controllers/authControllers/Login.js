const UsersCollection = require("../../models/Users");
const { decryptPwd } = require("../../util/bcryptHelper");
const { signToken } = require("../../util/tokenHelper");

const LoginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(404)
        .send({ msg: "No Empty values allowed", type: "error" });
    }

    const userAvailable = await UsersCollection.findOne({ email });
    if (!userAvailable) {
      return res.status(403).send({
        msg: "Provide valid credentials,no user present",
        type: "error",
      });
    }

    const hashedPwdFromDb = userAvailable.password;
    const isPwdMatch = await decryptPwd(password, hashedPwdFromDb);
    if (!isPwdMatch) {
      return res.status(403).send({
        msg: "Provide valid credentials",
        type: "error",
      });
    }
    // if matches, provide token
    const payLoad = {
      name: userAvailable.name,
      email: userAvailable.email,
      id: userAvailable._id,
    };
    const token = await signToken(payLoad);
    if (!token) {
      return res.send("no token");
    }
    res.send({
      msg: `Welcome ${userAvailable.name}`,
      type: "success",
      token,
      user: payLoad,
    });
  } catch (err) {
    return res.status(500).send({ msg: err.message, type: "error" });
  }
};

module.exports = LoginController;
