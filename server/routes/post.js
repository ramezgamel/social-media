const router = require("express").Router();
const controller = require("../controller/post");
const upload = require("../utils/upload");
const { protect } = require("../middleware/auth");

router.use(protect);
router
  .route("/")
  .post(upload.array("images", 5), controller.createPost)
  .get(controller.getFeedPosts);
router.get("/:userId", controller.getUserPosts);
router.patch("/:id", upload.array("images", 5), controller.updatePost);
router.post("/:id/like", controller.like);
router.post("/:id/comment", controller.addComment);
router.delete("/:id", controller.deletePost);
module.exports = router;
