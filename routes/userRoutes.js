const LoginController = require("../controllers/authControllers/Login");
const SignUpController = require("../controllers/authControllers/SignUp");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("users route");
});

router.post("/auth/signup", SignUpController);

router.post("/auth/login", LoginController);

module.exports = router;
