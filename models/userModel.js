const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please add username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please add email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please add password"],
    min: 6,
    max: 20,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("User", userSchema);
