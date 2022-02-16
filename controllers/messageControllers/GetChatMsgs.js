const ChatsCollection = require("../../models/Chats");
const MessagesCollection = require("../../models/Messages");

const GetChatMsgsController = async (req, res) => {
  const { chatBoxId } = req.params;
  try {
    if (!chatBoxId) {
      return res
        .status(404)
        .send({ type: "error", msg: "No empty value allowed" });
    }
    const chatBoxExists = await ChatsCollection.findById(chatBoxId);
    if (!chatBoxExists) {
      return res
        .status(404)
        .send({ type: "error", msg: "No Such ChatBox available" });
    }
    const chatMessages = await MessagesCollection.find({ chatBox: chatBoxId });

    res.send({ type: "success", msg: "Messages Fetched", chatMessages });
  } catch (err) {
    return res.status(500).send({ type: "error", msg: err.message });
  }
};

module.exports = GetChatMsgsController;
