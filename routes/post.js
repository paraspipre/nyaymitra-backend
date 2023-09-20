const { createPost, getAllPosts, getPost, photo } = require("../controllers/postController");

const router = require("express").Router();

router.post("/create/", createPost);
router.get("/all/", getAllPosts);
router.get("/:id", getPost);
router.get("/photo/:id", photo);



module.exports = router;
