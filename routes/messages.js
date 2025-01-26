const { addMessage, getMessages } = require("../controllers/messageController");
const { requireSignin, authMiddleware } = require("../controllers/userController");
const { verifyJWT } = require("../middlewares/auth.middleware");
const router = require("express").Router();

router.post("/addmsg/", verifyJWT, addMessage);
router.post("/getmsg/", verifyJWT, getMessages);

module.exports = router;
