const ChatsCollection = require("../../models/Chats");

const CreateNewChatBoxController = async (req, res) => {
  const { member } = req.body;
  const { id } = req.userObj;
  //here member is receiverid and id will have sender's id
  try {
    if (!member || !id) {
      return res
        .status(404)
        .send({ msg: "No empty values allowed", type: "error" });
    }
    if (member === id) {
      return res.status(401).send({
        msg: "senderid and receiver id cannot be same",
        type: "error",
      });
    }
    //need to check if a chatbox already available with these sender and receiver ids

    const membersArray = [id, member];
    const chatCreated = await ChatsCollection.create({
      isGroupChat: false,
      members: membersArray,
    });
    return res.send({ msg: "New Chat created", type: "success", chatCreated });
  } catch (err) {
    return res.status(500).send({ msg: err.message, type: "error" });
  }
};
module.exports = CreateNewChatBoxController;
