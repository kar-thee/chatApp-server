const { Router } = require("express");
const UserProfileController = require("../controllers/profileControllers/UserProfile");
const SearchUserController = require("../controllers/profileControllers/SearchUser");
const GetAllUsersController = require("../controllers/profileControllers/GetAllUsers");

const router = require("express").Router();

router.get("/:userId", UserProfileController);

router.get("/search/:searchkeyword", SearchUserController);

router.get("/get/allusers", GetAllUsersController);

module.exports = router;
