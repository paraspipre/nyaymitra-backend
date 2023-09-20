const { getAllUsers, connectLawyer, getUser } = require("../controllers/userController");

const router = require("express").Router();


router.get("/all", getAllUsers);
router.put("/connect", connectLawyer);
router.get("/:id", getUser);

module.exports = router;