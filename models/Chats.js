const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  isGroupChat: {
    type: Boolean,
  },
  members: [
    {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
  ],
  adminUser: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    default: undefined,
  },
  groupName: {
    type: String,
    default: undefined,
  },
});

const ChatsCollection = mongoose.model("ChatsCollection", chatSchema, "chats");

module.exports = ChatsCollection;
