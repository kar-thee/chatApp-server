const CreateNewChatBoxController = require("../controllers/chatBoxControllers/CreateNewChatBox");

const router = require("express").Router();

router.post("/create", CreateNewChatBoxController);

module.exports = router;
