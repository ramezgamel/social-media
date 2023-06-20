const asyncHandler = require("express-async-handler");
const Post = require("../models/post");
const httpStatusCode = require("../utils/httpStatusCode");
const User = require("../models/user");
const AppError = require("../utils/AppError");

module.exports.createPost = asyncHandler(async (req, res) => {
  const { _id, lastName, firstName, image } = req.user;
  const newPost = new Post({
    userId: _id,
    lastName,
    firstName,
    userPic: image,
    content: req.body.content,
    likes: [],
  });
  if (req.files) {
    let imagesName = [];
    for (let file of req.files) {
      imagesName.push(file.filename);
    }
    newPost.images = imagesName;
  }
  await newPost.save();
  const posts = await Post.find();
  const user = await User.findById(_id);
  user.posts.push(newPost);
  await user.save();
  res
    .status(httpStatusCode.CREATED)
    .json({ status: true, res: posts, massage: "Post created" });
});
module.exports.getFeedPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find();
  res
    .status(httpStatusCode.OK)
    .json({ status: true, res: posts, massage: "Posts fetched" });
});

module.exports.updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (req.user._id != post.userId)
    throw new AppError(
      `Only user can update his post`,
      httpStatusCode.FORBIDDEN
    );
  post.content = req.body.content;
  if (req.files) {
    let imagesName = [];
    for (let file of req.files) {
      imagesName.push(file.filename);
    }
    post.images = imagesName;
  }
  await post.save();

  res
    .status(httpStatusCode.OK)
    .json({ status: true, res: post, massage: "Post updated" });
});
module.exports.deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (req.user._id != post.userId)
    throw new AppError(
      `Only user can update his post`,
      httpStatusCode.FORBIDDEN
    );
  await Post.findByIdAndDelete(id);
  res
    .status(httpStatusCode.NO_CONTENT)
    .json({ status: true, res: {}, massage: "Post deleted" });
});
module.exports.like = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const post = await Post.findById(id);
  if (!post) throw new AppError("Invalid id ", httpStatusCode.BAD_REQUEST);
  const isLiked = post.likes.get(userId.toString());
  if (isLiked) {
    post.likes.delete(userId);
  } else {
    post.likes.set(userId, true);
  }
  await post.save();
  res
    .status(httpStatusCode.OK)
    .json({ status: true, res: post, massage: "Like" });
});
module.exports.addComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { content } = req.body;
  const post = await Post.findByIdAndUpdate(
    id,
    {
      $push: { comments: { content, userId } },
    },
    { new: true }
  );

  res
    .status(httpStatusCode.OK)
    .json({ status: true, res: post.comments, massage: "Comment added" });
});
module.exports.getUserPosts = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const posts = await Post.find({ userId });

  res
    .status(httpStatusCode.OK)
    .json({ status: true, res:  posts , massage: "Like" });
});
