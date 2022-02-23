const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "UsersCollection",
    },
    content: {
      type: String,
    },
    chatBox: {
      type: mongoose.Types.ObjectId,
      ref: "ChatsCollection",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const MessagesCollection = mongoose.model(
  "MessagesCollection",
  MessageSchema,
  "messages"
);

module.exports = MessagesCollection;
