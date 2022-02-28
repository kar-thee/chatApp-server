const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email",
    },
    unique: true,
    required: true,
  },
  password: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(v);
      },
      message: "Please enter a strong password",
    },
    required: true,
  },
});

//creating search index so that we can use $text in find()
userSchema.index({ name: "text", email: "text" }, { default_language: "none" });

const UsersCollection = mongoose.model("UsersCollection", userSchema, "users");

module.exports = UsersCollection;
