const UserProfileController = require("../controllers/profileControllers/UserProfile");

const router = require("express").Router();

router.get("/:userId", UserProfileController);

module.exports = router;
