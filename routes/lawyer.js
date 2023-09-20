const { getAllLawyers, getLawyer } = require("../controllers/lawyerController");

const router = require("express").Router();



router.get("/all", getAllLawyers);
router.get("/:id", getLawyer);

module.exports = router;