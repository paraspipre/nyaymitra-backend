const Lawyer = require("../models/lawyerModel");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const { expressjwt: expressJwt } = require("express-jwt");
require('dotenv').config("../.env")
const fs = require("fs")

const formidable = require('formidable');


module.exports.lawyerLogin = async (req, res, next) => {
   try {
      const { regno, password } = req.body;
      const lawyer = await Lawyer.findOne({ regno });
      if (!lawyer) return res.status(400).send("lawyer not exist");

      const isMatch = await bcrypt.compare(password, lawyer.password);
      if (!isMatch) return res.status(400).send("Email or password is incorrect");

      const token = jwt.sign({ _id: lawyer._id }, "secret");

      res.cookie("auth-token", token)
      res.json({ token, lawyer })

   } catch (err) {
      res.status(400).send(err.message);
   }
};

module.exports.lawyerRegister = async (req, res) => {

   try {
      console.log(req.body)
      const { name, regno, phone, date, password, bio, fields, tags } = req.body;
      const lawyerExists = await Lawyer.findOne({ regno })
      if (lawyerExists) return res.status(400).send("Lawyer already exists");


      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt);


      let lawyer = new Lawyer()
      lawyer.name = name;
      lawyer.password = hashedPassword
      lawyer.regno = regno
      lawyer.phone = phone
      lawyer.date = date
      lawyer.bio = bio
      lawyer.fields = fields
      lawyer.tags = tags


      lawyer.save()

      const token = jwt.sign({ _id: lawyer._id }, "secret");
      res.cookie("token", token)
      res.json({ token, lawyer })


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

module.exports.getAllLawyers = async (req, res, next) => {
   try {
      Lawyer.find().then((lawyers, err) => {
         if (err || !lawyers) {
            console.log(err)
            return res.status(400).json({
               err
            })
         }
         return res.json(lawyers);
      }).catch((err) => {
         console.log(err)
      })

   } catch (err) {
      console.log(err);
   }
};

module.exports.getLawyer = async (req, res, next) => {
   try {
      const loggeduserID = req.params.id;
      const lawyer = await Lawyer.findById(loggeduserID)

      if (!lawyer) {
         return res.status(404).json({
            err: "user not found"
         })
      }
      return res.json(lawyer);
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
   res.clearCookie("token")
   res.json({
      message: "Signout success"
   })
};

exports.photo = (req, res) => {
   const name = req.params.name
   User.findOne({ name })
      .select('image')
      .exec((err, user) => {
         if (err || !user) {
            return res.status(400).json({
               err
            });
         }
         res.set('Content-Type', user.image.contentType)
         res.send(user.image.data)
      });
};
