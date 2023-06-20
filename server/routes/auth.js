const router = require("express").Router();
const controller = require("../controller/auth");
const upload = require("../utils/upload");

router.post("/register", upload.single("image"), controller.register);
router.post("/login", controller.login);

module.exports = router;
