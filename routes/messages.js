const { addMessage, getMessages } = require("../controllers/messageController");
const { requireSignin, authMiddleware } = require("../controllers/userController");
const router = require("express").Router();

router.post("/addmsg/", requireSignin, authMiddleware, addMessage);
router.post("/getmsg/", requireSignin, authMiddleware, getMessages);

module.exports = router;
