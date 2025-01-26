const { getChatHistory, createChat, getAllUsers, connectLawyer, getUser, sendRequest, authMiddleware, requireSignin, acceptRequest, updateUserAvatar, getRequests, getChat, updateChat, updateChatTitle, deleteChat, getConnections } = require("../controllers/userController");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = require("express").Router();
const {upload} = require("../middlewares/multer.middleware")

router.get("/all", getAllUsers);
router.post("/sendRequest", verifyJWT, sendRequest);
router.post("/acceptRequest", verifyJWT, acceptRequest)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.get("/", requireSignin, authMiddleware, getUser);
router.get("/requests", verifyJWT, getRequests);
router.get("/connections", verifyJWT, getConnections);
router.get("/history",requireSignin, authMiddleware, getChatHistory)
router.post("/chat", requireSignin, authMiddleware, createChat)
router.route("/chat/:chatid").get(requireSignin, authMiddleware, getChat).put(requireSignin, authMiddleware, updateChat).patch(requireSignin, authMiddleware, updateChatTitle).delete(requireSignin, authMiddleware, deleteChat)
module.exports = router;