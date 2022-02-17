const ChatsCollection = require("../../models/Chats");
const mongoose = require("mongoose");

const GetAllChatBoxesController = async (req, res) => {
  const { userId } = req.params;

  try {
    const allChats = await ChatsCollection.find({
      members: {
        $in: [userId],
      },
    }).populate("members", "_id name email");

    const chatBoxes = allChats.map((chatObj) =>
      chatObj.isGroupChat === true
        ? {
            id: chatObj._id,
            isGroupChat: chatObj.isGroupChat,
            members: chatObj.members,
            chatName: chatObj.groupName,
            adminUser: chatObj.adminUser,
          }
        : {
            id: chatObj._id,
            isGroupChat: chatObj.isGroupChat,
            members: chatObj.members,
            chatName: chatObj.members.find(
              (memberObj) => !memberObj._id.equals(userId)
            )["name"],
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
