const router = require("express").Router();
const { protect } = require("../middleware/auth");
const controller = require("../controller/user");

router.get("/:id", protect, controller.getUser);
router.get("/:id/friends", protect, controller.getUserFriends);
router.patch("/:id/:friendID", protect, controller.addRemoveFriend);

module.exports = router;
