const CreateNewMsgController = require("../controllers/messageControllers/CreateNewMsg");
const GetChatMsgsController = require("../controllers/messageControllers/GetChatMsgs");

const router = require("express").Router();

router.post("/create", CreateNewMsgController);

router.get("/:chatBoxId", GetChatMsgsController);

module.exports = router;
