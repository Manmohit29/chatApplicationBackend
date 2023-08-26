const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

//REGISTER
const register = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  const usernameCheck = await User.findOne({ username });
  if (usernameCheck) {
    return res.json({ message: "Username already in use", status: false });
  }
  const emailCheck = await User.findOne({ email });
  if (emailCheck) {
    return res.json({ message: "Email already in use", status: false });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const registerUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  return res.json({
    status: true,
    registeredUser: {
      id: registerUser.id,
      username: registerUser.username,
      email: registerUser.email,
    },
  });
});

//LOGIN
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.json({
      message: "Please enter correct Username",
      status: false,
    });
  } else {
    const validatePassword = await bcrypt.compare(password, user.password);
    if (validatePassword) {
      return res.json({
        status: true,
        loggedInUser: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });
    }
    return res.json({ message: "Password is Incorrect", status: false });
  }
});

//GET ALL USERS
const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await User.find({ _id: { $ne: req.params.id } }).select([
    "email",
    "username",
    "_id",
  ]);
  return res.json(allUsers);
});

module.exports = { register, login, getAllUsers };
