const ChatsCollection = require("../../models/Chats");
const MessagesCollection = require("../../models/Messages");

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
    //check if a chatbox already available with these sender and receiver ids
    const chatAlreadyAvailable = await ChatsCollection.find({
      members: {
        $all: [id, member],
      },
      isGroupChat: false,
    });
    if (chatAlreadyAvailable.length > 0) {
      return res.send({
        type: "success",
        msg: "Chat already available",
        chatCreated: chatAlreadyAvailable,
      });
    }

    const membersArray = [id, member];
    const chatCreated = await ChatsCollection.create({
      isGroupChat: false,
      members: membersArray,
    });

    //here msg from both users like `Hi`
    [id, member].forEach(async (senderId, ind) => {
      const chatBox = chatCreated._id;
      const sender = senderId;
      const content = "Hi";
      try {
        const msgPosted = await MessagesCollection.create({
          sender,
          content,
          chatBox,
        });
        //saving time by saving only last users msg as lastMsg
        if (ind % 2 === 0) {
          chatBoxExists.lastMsgId = msgPosted._id;
          await chatBoxExists.save();
        }
      } catch (err) {
        return res.status(500).send({ msg: err.message, type: "error" });
      }
    });

    return res.send({
      msg: "New Chat created",
      type: "success",
      chatCreated: [chatCreated],
    });
  } catch (err) {
    return res.status(500).send({ msg: err.message, type: "error" });
  }
};
module.exports = CreateNewChatBoxController;
