const mongoose = require("mongoose");
const { isEmail } = require('validator')
const { ObjectId } = mongoose.Schema
const userSchema = new mongoose.Schema({

   //common
   name: {
      type: String,
      required: [true, 'Please enter name'],
      min: 3,
   },
   email: {
      type: String,
      max: 50,
      validate: [isEmail, 'Please enter a valid email']
   },
   username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
   },
   hashed_password: {
      type: String,
   },
   image: {
      type: String
   },
   role: Number,
   phone: {
      type: Number
   },
   date: Date,
   chatHistory: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Chat"
      }
   ],
   connections: [{
      type: ObjectId,
      ref: "User"
   }],

   //lawyer
   requests: [{
      type: ObjectId,
      ref: "Request"
   }],
   regno: {
      type: String,
      default:"MPf0239/30",
      max: 50,
   },
   bio: {
      type: String,
      // smin: [1000, 'Bio must be greater than 100 words'],
   },
   specialization: [
      {
         type:String
      }
   ],
   address: {
      type:String
   },
   tags: {
      type: String
   }
}, { timestamps: true });


module.exports = mongoose.model("User", userSchema);
