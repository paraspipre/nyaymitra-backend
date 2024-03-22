const { getAllUsers, connectLawyer, getUser, sendRequest, authMiddleware, requireSignin, acceptRequest, updateUserAvatar, getRequests } = require("../controllers/userController");

const router = require("express").Router();
const {upload} = require("../middlewares/multer.middleware")

router.get("/all", getAllUsers);
router.post("/sendRequest", requireSignin, authMiddleware, sendRequest);
router.post("/acceptRequest", requireSignin, authMiddleware, acceptRequest)
router.route("/avatar").patch(requireSignin, authMiddleware, upload.single("avatar"), updateUserAvatar)
router.get("/", requireSignin, authMiddleware, getUser);
router.get("/requests", requireSignin, authMiddleware, getRequests);
// router.get("connectLawyer/:id", getUser);

module.exports = router;