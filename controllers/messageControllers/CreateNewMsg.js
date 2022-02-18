const ChatsCollection = require("../../models/Chats");
const MessagesCollection = require("../../models/Messages");

const CreateNewMsgController = async (req, res) => {
  const { sender, content, chatBox } = req.body;
  const { id } = req.userObj;
  try {
    if (!sender || !content || !chatBox) {
      return res
        .status(404)
        .send({ msg: "No empty values allowed", type: "error" });
    }
    if (sender !== id) {
      return res.status(403).send({
        msg: "SenderId is different from token id..invalid request only",
        type: "error",
      });
    }
    //check chatBox exists and add msgId to chatBox's lastMsg
    const chatBoxExists = await ChatsCollection.findById(chatBox);
    if (!chatBoxExists) {
      return res
        .status(404)
        .send({ type: "error", msg: "No Such ChatBox available" });
    }

    const msgPosted = await MessagesCollection.create({
      sender,
      content,
      chatBox,
    });

    chatBoxExists.lastMsgId = msgPosted._id;
    await chatBoxExists.save();

    res.send({ type: "success", msg: "Message sent", msgPosted });
  } catch (err) {
    return res.status(500).send({ msg: err.message, type: "error" });
  }
};

module.exports = CreateNewMsgController;
