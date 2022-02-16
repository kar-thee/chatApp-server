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

    const msgPosted = await MessagesCollection.create({
      sender,
      content,
      chatBox,
    });

    res.send({ type: "success", msg: "Message sent", msgPosted });
  } catch (err) {
    return res.status(500).send({ msg: err.message, type: "error" });
  }
};

module.exports = CreateNewMsgController;
