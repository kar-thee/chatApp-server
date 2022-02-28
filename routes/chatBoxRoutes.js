const CreateNewChatBoxController = require("../controllers/chatBoxControllers/CreateNewChatBox");
const GetAllChatBoxesController = require("../controllers/chatBoxControllers/GetAllChatBoxes");
const CreateGroupChatController = require("../controllers/groupChat/CreateGroupChat");

const router = require("express").Router();

// create new chat
router.post("/create", CreateNewChatBoxController);

// get all chats of a user
router.get("/getAll/:userId", GetAllChatBoxesController);

//create groupchat
router.post("/group/create", CreateGroupChatController);

module.exports = router;
