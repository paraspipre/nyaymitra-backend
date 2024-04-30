const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const { expressjwt: expressJwt } = require("express-jwt");
require('dotenv').config("../.env")
const fs = require("fs")
const formidable = require('formidable');
const nodemailer = require("nodemailer");
const shortId = require('shortid');
const Request = require("../models/RequestModel")
const { asyncHandler } = require("../utils/asyncHandler.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { ApiError } = require("../utils/ApiError.js");

const transporter = nodemailer.createTransport({
   service: 'gmail',
   host: "smtp.gmail.com",
   port: 465,
   secure: true,
   auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.PASS,
   },
   tls: {
      rejectUnauthorized: false
   }
});

exports.preSignup = async (req, res) => {
   try {
      const { name, email, password, role, regno, phone, date } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() })
      if (user) {
         return res.status(400).send('Email is taken');
      }
      const data = { name, email: email.toLowerCase(), password, role, regno, phone, date }
      const token = jwt.sign(data, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10m' });


      const emailData = {
         from: process.env.EMAIL_FROM,
         to: email,
         subject: `Account activation link`,
         html: `
            <p>Please use the following link to activate your acccount:</p>
            <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
            <hr />
            <p>This email may contain sensetive information</p>
            <p>https://nyaymitra-rho.vercel.app</p>
        `
      };

      transporter.sendMail(emailData).then(sent => {
         return res.json({
            message: `Email has been sent to ${email}. Follow the instructions to activate your account.`
         });
      }).catch(err => {
         console.log(err)
         return res.status(400).send('email not sent')
      })
   } catch (err) {
      res.status(400).send(err.message)
   }

};

exports.signup = (req, res) => {
   try {
      const activatetoken = req.body.token;
      if (activatetoken) {
         jwt.verify(activatetoken, process.env.JWT_ACCOUNT_ACTIVATION, async function (err, decoded) {
            if (err) {
               return res.status(401).send('Expired link. Signup again');
            }

            const { name, email, password, role, regno, phone, date } = jwt.decode(activatetoken);

            let username = email.split("@")[0];

            const salt = await bcrypt.genSalt(10)

            const hashed_password = await bcrypt.hash(password, salt)

            let user
            if (role === 0) {
               user = new User({ name, email, hashed_password, username, role });
            } else {
               user = new User({ name, email, hashed_password, username, role, regno, phone, date });
            }
            user.save().then((user, err) => {
               if (err) {
                  console.log(err)
                  return res.status(401).send(err.message)
               }
               const token = jwt.sign({ _id: user._id }, process.env.secret);
               res.cookie("token", token)
               return res.json({
                  user: { _id, name, email, username, role },
                  token,
                  message: 'Singup success! Please signin'
               });
            })
         });
      } else {
         return res.json({
            message: 'Something went wrong. Try again'
         });
      }
   } catch (err) {
      res.status(400).send(err.message)
   }
};

module.exports.altsignup = async (req, res) => {
   try { 
      const { name, email, password, role, regno, phone, date , specialization,address,tags } = req.body;
      const userexist = await User.findOne({ email: email.toLowerCase() })
      if (userexist) {
         return res.status(400).send('Email is taken');
      }
      let username = email.split("@")[0];

      const salt = await bcrypt.genSalt(10)

      const hashed_password = await bcrypt.hash(password, salt)

      let user
      if (role === 0) {
         user = new User({ name, email, hashed_password, username, role });
      } else {
         user = new User({ name, email, hashed_password, username, role, regno, phone, date, specialization, address,tags });
      }
      user.save().then((user, err) => {
         if (err) {
            console.log(err)
            return res.status(401).send(err.message)
         }
         const token = jwt.sign({ _id: user._id }, process.env.secret);
         res.cookie("token", token)
         return res.status(200).json({
            user: { _id: user._id, name, email, username, role },
            token,
            message: 'Singup success! Please signin'
         });
      })
   } catch (err) {
      console.log(err)
   }
}

module.exports.signin = async (req, res, next) => {
   try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(400).send("User not exist");

      const isMatch = await bcrypt.compare(password, user.hashed_password);
      if (!isMatch) return res.status(400).send("Email or password is incorrect");

      const token = jwt.sign({ _id: user._id }, process.env.secret);
      const { name, username, role, _id } = user
      res.cookie("token", token)
      res.json({ token, user: { _id, name, email, username, role } })

   } catch (err) {
      res.status(400).send(err.message);
   }
};

exports.signout = (req, res) => {
   res.clearCookie("token")
   res.json({
      message: "Signout success"
   })
}



exports.requireSignin = expressJwt({
   secret: process.env.secret, algorithms: ['HS256']
})

exports.authMiddleware = (req, res, next) => {
   const authUserId = req?.auth?._id
   console.log(authUserId)
   User.findById({ _id: authUserId }).then((user, err) => {
      if (err || !user) {
         return res.status(400).send('User not found')
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
            return res.status(400).send(err.message)
         }
         return res.json(users);
      }).catch((err) => {
         console.log(err)
      })

   } catch (err) {
      res.status(400).send(err.message);
   }
};

module.exports.sendRequest = async (req, res) => {
   try {
      const user = req.profile
      const { sub, desc, lawyer } = req.body;
      console.log(lawyer, "ssdfsd")
      const request = await Request.create({ subject: sub, description: desc, receiver: lawyer, sender: user._id })
      const lawyerdata = await User.findByIdAndUpdate(lawyer, { $push: { requests: request._id } },{new:true})
      return res.json({ message: "requst sent", lawyerdata })
   } catch (err) {
      res.status(400).send(err.message);
   }
}

module.exports.acceptRequest = async (req, res) => {
   try {
      const lawyerdata = req.profile
      const { userid, reqid } = req.body
      const reqdata = await Request.findByIdAndDelete(reqid)
      const user = await User.findByIdAndUpdate(userid, { $push: { connections: lawyerdata._id } },{new:true})
      const lawyer = await User.findByIdAndUpdate(lawyerdata._id, { $push: { connections: userid },$pull:{requests:reqid} }, { new: true })
      return res.json({ message: "requst accepted" ,user,lawyer})
         
   } catch (err) {
      res.status(400).send(err.message);
   }
}

module.exports.updateUserAvatar = asyncHandler(async (req, res) => {
   const avatarLocalPath = req.file?.path
   console.log(avatarLocalPath, "fsfs")

   if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is missing")
   }

   //TODO: delete old image - assignment

   const avatar = await uploadOnCloudinary(avatarLocalPath)

   if (!avatar.url) {
      throw new ApiError(400, "Error while uploading on avatar")

   }

   const user = await User.findByIdAndUpdate(
      req.profile?._id,
      {
         $set: {
            image: avatar.url
         }
      },
      { new: true }
   ).select("-hashedpassword")

   return res
      .status(200)
      .json(
         new ApiResponse(200, user, "Avatar image updated successfully")
      )
})


module.exports.getConnections = async (req, res, next) => {
   try {
      const user = await User.findById(req.profile._id).populate("connections")

      if (!user) {
         return res.status(404).json({
            err: "user not found"
         })
      }
      return res.json({connections: user.connections});

   } catch (err) {
      res.status(400).send(err.message);
   }
};

module.exports.getUser = async (req, res, next) => {
   try {
      const user = await User.findById(req.profile._id)

      if (!user) {
         return res.status(404).json({
            err: "user not found"
         })
      }
      return res.json(user);

   } catch (err) {
      res.status(400).send(err.message);
   }
};

module.exports.getRequests = async (req, res, next) => {
   try {
      const requests = await Request.find({receiver : req.profile._id}).populate("sender")

      if (!requests) {
         return res.status(404).json({
            err: "request not found"
         })
      }
      return res.json(requests);

   } catch (err) {
      res.status(400).send(err.message);
   }
};

// module.exports.like = async (req, res) => {
//    try {
//       const { userId, likedUserId } = req.body;
//       const user = await User.findOne({ email: userId });
//       const likedUser = await User.findOne({ email: likedUserId });
//       user.likes.push(likedUserId);
//       await user.save();

//       res.send("Image liked!");
//    } catch (err) {
//       res.status(400).send(err.message);
//    }
// }


// module.exports.superlike = async (req, res, next) => {
//    try {
//       const { userId, superlikedUserId } = req.body;
//       const user = await User.findOne({ email: userId });
//       const superlikedUser = await User.findOne({ email: superlikedUserId });
//       user.superlikes.push(superlikedUserId);
//       await user.save();

//       res.send("Image superliked!");
//    } catch (err) {
//       res.status(400).send(err.message);
//    }
// };

// module.exports.block = async (req, res, next) => {
//    try {
//       const { userId, blockedUserId } = req.body;
//       const user = await User.findOne({ email: blockedUserId });
//       user.blockedUsers.push(userId);
//       await user.save();
//       res.send("User blocked!");
//    } catch (err) {
//       res.status(400).send(err.message);
//    }
// };

module.exports.logOut = (req, res, next) => {
   try {
      if (!req.params.id) return res.json({ msg: "User id is required " });
      console.log(onlineUsers)
      res.clearCookie("token")
      onlineUsers.splice(onlineUsers.indexOf(req.params.id, 1))
      return res.status(200).send();
   } catch (err) {
      res.status(400).send(err.message);
   }
};