const CreateNewMsgController = require("../controllers/messageControllers/CreateNewMsg");
const GetChatMsgsController = require("../controllers/messageControllers/GetChatMsgs");

const router = require("express").Router();

// create msg
router.post("/create", CreateNewMsgController);

//get all msgs of a chat
router.get("/:chatBoxId", GetChatMsgsController);

module.exports = router;
