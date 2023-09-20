const { lawyerLogin, lawyerRegister, getAllLawyers } = require("../controllers/lawyerController");
const {
   userRegister,
   userLogin,
   logOut,
   getAllUsers,
   connectLawyer,
   // like,
   // superlike,
   // block,
   // photo,
   // getUser,
} = require("../controllers/userController");

const router = require("express").Router();



router.post("/user/login", userLogin);
router.post("/user/register", userRegister);
router.post("/lawyer/login", lawyerLogin);
router.post("/lawyer/register", lawyerRegister);
router.get("/logout/:id", logOut);


// router.get('/image/:name', photo);
// router.post("/like", like)
// router.post("/superlike", superlike)
// router.post("/block", block)
module.exports = router;


