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
   altsignup,
   updateUser,
   // like,
   // superlike,
   // block,
   // photo,
   // getUser,
} = require("../controllers/userController");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = require("express").Router();

router.post("/signup", preSignup);
router.post("/altsignup", altsignup);
router.post("/activate", signup)
router.post("/signin", signin);
router.get("/logout", signout);
router.patch("/update", verifyJWT, updateUser);



// router.get('/image/:name', photo);
// router.post("/like", like)
// router.post("/superlike", superlike)
// router.post("/block", block)
module.exports = router;


