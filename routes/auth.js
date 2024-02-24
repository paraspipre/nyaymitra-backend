// const { lawyerLogin, lawyerRegister, getAllLawyers } = require("../../lawyerController");
const {
   userRegister,
   userLogin,
   logOut,
   getAllUsers,
   connectLawyer,
   userSignup,
   preSignup,
   signout,
   signin,
   signup,
   // like,
   // superlike,
   // block,
   // photo,
   // getUser,
} = require("../controllers/userController");

const router = require("express").Router();



router.post("/signin", signin);
router.post("/signup", preSignup);
router.post("/activate", signup)
router.get("/logout", signout);


// router.get('/image/:name', photo);
// router.post("/like", like)
// router.post("/superlike", superlike)
// router.post("/block", block)
module.exports = router;


