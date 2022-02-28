const ChatsCollection = require("../../models/Chats");

const CreateGroupChatController = async (req, res) => {
  const { members, adminUser, groupName } = req.body;
  const { id } = req.userObj;
  //here members is receiveridArray and id will have sender's id
  //members = array of ids
  //adminUser = id
  //groupName =string

  try {
    if (members.length < 1 || !members || !id) {
      return res
        .status(404)
        .send({ msg: "No empty values allowed", type: "error" });
    }

    const membersArray = [id, ...members];
    const chatCreated = await ChatsCollection.create({
      isGroupChat: true,
      members: membersArray,
      adminUser,
      groupName,
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
