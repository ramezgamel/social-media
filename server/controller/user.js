const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const httpStatus = require("../utils/httpStatusCode");

module.exports.getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res
    .status(httpStatus.OK)
    .json({ status: true, res: user, msg: "User fetched." });
});
module.exports.addRemoveFriend = asyncHandler(async (req, res) => {
  const { id, friendID } = req.params;
  const user = await User.findById(id);
  const friend = await User.findById(friendID);
  if (user.friends.includes(friendID)) {
    user.friends = user.friends.filter((id) => {
      id !== friendID;
    });
    friend.friends = friend.friends.filter((id) => id !== id);
  } else {
    user.friends.push(friendID);
    friend.friends.push(id);
  }
  await user.save();
  await friend.save();
  const friends = Promise.all(user.friends.map((_id) => User.findById(_id)));
  const formattedFriends = (await friends).map(
    ({ _id, firstName, lastName, location, occupation, image }) => {
      return { _id, firstName, lastName, location, occupation, image };
    }
  );
  res
    .status(httpStatus.OK)
    .json({
      status: true,
      res: formattedFriends,
      msg: "New friendsList fetched.",
    });
});
module.exports.getUserFriends = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  const friends = Promise.all(user.friends.map((_id) => User.findById(_id)));
  const formattedFriends = (await friends).map(
    ({ _id, firstName, lastName, location, occupation, image }) => {
      return { _id, firstName, lastName, location, occupation, image };
    }
  );
  res
    .status(httpStatus.OK)
    .json({ status: true, res: formattedFriends, msg: "Friends fetched." });
});
