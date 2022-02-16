const UsersCollection = require("../../models/Users");
const { encryptPwd } = require("../../util/bcryptHelper");

const SignUpController = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!email || !name || !password) {
      return res
        .status(404)
        .send({ msg: "No Empty values allowed", type: "error" });
    }

    const userAvailable = await UsersCollection.findOne({ email });
    if (userAvailable) {
      return res
        .status(400)
        .send({ msg: "User with same emailId present already", type: "error" });
    }

    const hashedPwd = await encryptPwd(password);
    const userSaved = await UsersCollection.create({
      name,
      email,
      password: hashedPwd,
    });

    res.send({
      msg: "User registered successfully",
      type: "success",
      userSaved,
    });
  } catch (err) {
    return res.status(500).send({ msg: err.message, type: "error" });
  }
};

module.exports = SignUpController;
