const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    images: Array,
    userPic: String,
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: [
      {
        content: {
          type: String,
          required: true,
        },
        userId: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
