const UsersCollection = require("../../models/Users");

const UserProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return res
        .status(404)
        .send({ type: "error", msg: "No empty values allowed" });
    }
    const userAvailable = await UsersCollection.findById(
      userId,
      "_id name email"
    );
    if (!userAvailable) {
      return res.status(404).send({ type: "error", msg: "No user Found" });
    }
    res.send({
      msg: "Profile Fetched",
      type: "success",
      userData: userAvailable,
    });
  } catch (err) {
    return res.status(500).send({ type: "error", msg: err.message });
  }
};

module.exports = UserProfile;
