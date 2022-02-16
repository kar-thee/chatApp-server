const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    content: {
      type: String,
    },
    chatBox: {
      type: mongoose.Types.ObjectId,
      ref: "chats",
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
