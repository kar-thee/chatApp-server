const ChatsCollection = require("../../models/Chats");
const MessagesCollection = require("../../models/Messages");

const GetChatMsgsController = async (req, res) => {
  const { chatBoxId } = req.params;
  const { id } = req.userObj;
  try {
    if (!chatBoxId) {
      return res
        .status(404)
        .send({ type: "error", msg: "No empty value allowed" });
    }
    const chatBoxExists = await ChatsCollection.findById(chatBoxId).populate(
      "members",
      "name email"
    );
    if (!chatBoxExists) {
      return res
        .status(404)
        .send({ type: "error", msg: "No Such ChatBox available" });
    }

    const chatBoxData =
      chatBoxExists.isGroupChat === true
        ? {
            id: chatBoxExists._id,
            isGroupChat: chatBoxExists.isGroupChat,
            members: chatBoxExists.members,
            chatName: chatBoxExists.groupName,
            chatSubtitle: `${chatBoxExists.members
              .filter((member) => {
                return !member._id.equals(id);
              })
              .map((member) => member.name)
              .join(", ")} and You`,
            chatProfile: "", //need to fill it later
            adminUser: chatBoxExists.adminUser,
            lastMsg: chatBoxExists.lastMsgId,
          }
        : {
            id: chatBoxExists._id,
            isGroupChat: chatBoxExists.isGroupChat,
            members: chatBoxExists.members,
            chatSubtitle: "",
            chatName: chatBoxExists.members.find(
              (memberObj) => !memberObj._id.equals(id)
            )["name"],
            chatProfile: chatBoxExists.members.find(
              (memberObj) => !memberObj._id.equals(id)
            )["_id"],
            lastMsg: chatBoxExists.lastMsgId,
          };

    const chatMessages = await MessagesCollection.find({
      chatBox: chatBoxId,
    }).populate("sender", "name email");

    res.send({
      type: "success",
      msg: "Messages Fetched",
      chatMessages,
      chatBoxInfo: chatBoxData,
    });
  } catch (err) {
    return res.status(500).send({ type: "error", msg: err.message });
  }
};

module.exports = GetChatMsgsController;
