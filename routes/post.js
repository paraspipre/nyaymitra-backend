const { createPost, getAllPosts, getPost, photo } = require("../controllers/postController");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/multer.middleware");

const router = require("express").Router();

router.post("/create", verifyJWT, upload.single("image"), createPost);
router.get("/all/", getAllPosts);



module.exports = router;
