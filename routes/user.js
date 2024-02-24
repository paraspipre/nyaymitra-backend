const { getAllUsers, connectLawyer, getUser, sendRequest } = require("../controllers/userController");

const router = require("express").Router();


router.get("/all", getAllUsers);
router.put("/sendRequest", sendRequest);
router.get("/:id", getUser);

module.exports = router;