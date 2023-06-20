const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const httpStatus = require("../utils/httpStatusCode");
const AppError = require("../utils/AppError");

module.exports.register = asyncHandler(async (req, res) => {
  if (req.file) {
    req.body.image = req.file.filename;
  }
  const {
    firstName,
    lastName,
    email,
    password,
    image,
    friends,
    location,
    occupation,
  } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    image,
    friends,
    location,
    occupation: Math.floor(Math.random() * 10000),
    impression: Math.floor(Math.random() * 10000),
  });
  await newUser.save();
  res
    .status(httpStatus.CREATED)
    .json({ status: true, res: newUser, msg: "User Created" });
});

module.exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    throw new AppError("Invalid email or password", httpStatus.BAD_REQUEST);
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword)
    throw new AppError("Invalid email or password", httpStatus.BAD_REQUEST);
  const token = jwt.sign({ id: user._id }, process.env.JWT_SEC);
  res
    .status(httpStatus.OK)
    .json({ status: true, res: { token, user }, msg: "Your are logged in." });
});
