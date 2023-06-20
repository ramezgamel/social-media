const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const httpStatus = require("../utils/httpStatusCode");
const User = require("../models/user");

module.exports.protect = asyncHandler(async (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) throw new AppError(`Access Denied`, httpStatus.FORBIDDEN);
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trimLeft();
  }
  const decoded = jwt.verify(token, process.env.JWT_SEC);
  const user = await User.findById(decoded.id);
  req.user = user;
  next();
});
