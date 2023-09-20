const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const { expressjwt: expressJwt } = require("express-jwt");
require('dotenv').config("../.env")
const fs = require("fs")

const formidable = require('formidable');
const Lawyer = require("../models/lawyerModel");


module.exports.userLogin = async (req, res, next) => {
   try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).send("User not exist");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).send("Email or password is incorrect");

      const token = jwt.sign({ _id: user._id }, process.env.secret);

      res.cookie("token", token)
      res.json({ token, user })

   } catch (err) {
      res.status(400).send(err.message);
   }
};

module.exports.userRegister = async (req, res) => {
   try {
      console.log(req)
      const { name, email, password } = req.body;
      const userExists = await User.findOne({ email })
      if (userExists) return res.status(400).send("User already exists");


      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt);


      let user = new User()
      user.name = name;
      user.email = email
      user.password = hashedPassword
      user.save()

      const token = jwt.sign({ _id: user._id }, "secret");
      res.cookie("token", token)
      res.json({ token, user })
   } catch (err) {
      res.status(400).send(err.message);
   }
};


exports.requireSignin = expressJwt({
   secret: "process.env.secret", algorithms: ['RS256']
})

exports.authMiddleware = (req, res, next) => {
   const authUserId = req.user._id
   User.findById({ _id: authUserId }).exec((err, user) => {
      if (err || !user) {
         return res.status(400).json({
            error: 'User not found'
         })
      }
      req.profile = user
      next()
   })
}

module.exports.getAllUsers = async (req, res, next) => {
   try {
      User.find().then((users, err) => {
         if (err || !users) {
            console.log(err)
            return res.status(400).json({
               err
            })
         }
         return res.json(users);
      }).catch((err) => {
         console.log(err)
      })

   } catch (err) {
      console.log(err);
   }
};

module.exports.connectLawyer = async (req, res, next) => {
   try {
      const { userID, id } = req.body;
      console.log(userID, id, "id")
      const user = await User.findById(userID)
      if (user) {
         const lawyerdata = await Lawyer.findById(id)
         if (lawyerdata) {
            lawyerdata.users.push(userID)
            lawyerdata.save()
            user.lawyers.push(id);
            user.save()
            return res.json(user)
         }
      }

   } catch (err) {
      console.log(err)
   }
}

module.exports.getUser = async (req, res, next) => {
   try {
      const loggeduserID = req.params.id;
      const user = await User.findById(loggeduserID)

      if (!user) {
         return res.status(404).json({
            err: "user not found"
         })
      }
      return res.json(user);

   } catch (err) {
      console.log(err);
   }
};

module.exports.like = async (req, res) => {
   try {
      const { userId, likedUserId } = req.body;
      const user = await User.findOne({ email: userId });
      const likedUser = await User.findOne({ email: likedUserId });
      user.likes.push(likedUserId);
      await user.save();

      res.send("Image liked!");
   } catch (err) {
      res.status(400).send(err.message);
   }
}


module.exports.superlike = async (req, res, next) => {
   try {
      const { userId, superlikedUserId } = req.body;
      const user = await User.findOne({ email: userId });
      const superlikedUser = await User.findOne({ email: superlikedUserId });
      user.superlikes.push(superlikedUserId);
      await user.save();

      res.send("Image superliked!");
   } catch (err) {
      res.status(400).send(err.message);
   }
};

module.exports.block = async (req, res, next) => {
   try {
      const { userId, blockedUserId } = req.body;
      const user = await User.findOne({ email: blockedUserId });
      user.blockedUsers.push(userId);
      await user.save();
      res.send("User blocked!");
   } catch (err) {
      res.status(400).send(err.message);
   }
};



module.exports.logOut = (req, res, next) => {
   try {
      if (!req.params.id) return res.json({ msg: "User id is required " });
      console.log(onlineUsers)
      res.clearCookie("token")
      onlineUsers.splice(onlineUsers.indexOf(req.params.id, 1))
      return res.status(200).send();
   } catch (err) {
      console.log(err);
   }
};


