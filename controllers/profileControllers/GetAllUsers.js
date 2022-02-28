const UsersCollection = require("../../models/Users");

const GetAllUsers = async (req, res) => {
  try {
    const allUsers = await UsersCollection.find({}, "name email");

    res.send({ type: "success", allUsers });
  } catch (err) {
    return res.status(500).send({ type: "error", msg: err.message });
  }
};

module.exports = GetAllUsers;
