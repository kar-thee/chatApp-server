const ChatsCollection = require("../../models/Chats");
const MessagesCollection = require("../../models/Messages");

const CreateGroupChatController = async (req, res) => {
  const { members, adminUser, groupName } = req.body;
  const { id } = req.userObj;
  //here members is receiveridArray and id will have sender's id
  //members = array of ids
  //adminUser = id
  //groupName =string

  try {
    if (members.length < 1 || !members || !id || !groupName || !adminUser) {
      return res
        .status(404)
        .send({ msg: "No empty values allowed", type: "error" });
    }
    //here adding current user's id also with member
    //i.e group creator
    const membersArray = [id, ...members];
    const chatCreated = await ChatsCollection.create({
      isGroupChat: true,
      members: membersArray,
      adminUser,
      groupName,
    });

    //here we create first msg for all users
    membersArray.forEach(async (senderId, ind) => {
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
        if (ind === membersArray.length) {
          chatBoxExists.lastMsgId = msgPosted._id;
          await chatBoxExists.save();
        }
      } catch (err) {
        return res.status(500).send({ msg: err.message, type: "error" });
      }
    });

    return res.send({
      msg: "New GroupChat created",
      type: "success",
      chatCreated: [chatCreated],
    });
  } catch (err) {
    return res.status(500).send({ msg: err.message, type: "error" });
  }
};
module.exports = CreateGroupChatController;
