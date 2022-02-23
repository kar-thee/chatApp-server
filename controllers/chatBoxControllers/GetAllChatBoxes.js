const ChatsCollection = require("../../models/Chats");
const UsersCollection = require("../../models/Users");

const GetAllChatBoxesController = async (req, res) => {
  const { userId } = req.params;

  try {
    const userFound = await UsersCollection.findById(userId);
    if (!userFound) {
      return res.status(404).send({ msg: "No user Found", type: "error" });
    }
    const allChats = await ChatsCollection.find({
      members: {
        $in: [userId],
      },
    })
      .populate("members", "_id name email")
      .populate("lastMsgId");

    const chatBoxes = allChats.map((chatObj) =>
      chatObj.isGroupChat === true
        ? {
            id: chatObj._id,
            isGroupChat: chatObj.isGroupChat,
            members: chatObj.members,
            chatName: chatObj.groupName,
            adminUser: chatObj.adminUser,
            lastMsg: chatObj.lastMsgId,
          }
        : {
            id: chatObj._id,
            isGroupChat: chatObj.isGroupChat,
            members: chatObj.members,
            chatName: chatObj.members.find(
              (memberObj) => !memberObj._id.equals(userId)
            )["name"],
            lastMsg: chatObj.lastMsgId,
          }
    );
    res.send({
      type: "success",
      msg: "All chatboxes fetched",
      chatBoxes,
    });
  } catch (err) {
    return res.status(500).send({ msg: err.message, type: "error" });
  }
};

module.exports = GetAllChatBoxesController;
