// const { getAllLawyers, getLawyer } = require("../../lawyerController");

const { authMiddleware, acceptRequest, requireSignin } = require("../controllers/userController");

const router = require("express").Router();



// router.get("/all", getAllLawyers);
// router.get("/:id", getLawyer);
router.put("/acceptRequest", requireSignin, authMiddleware, acceptRequest)

module.exports = router;