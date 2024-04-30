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
      required: [true, 'Please enter email'],
      unique: true,
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
      type: Number,
      unique: true,
   },
   date: Date,
   bio: {
      type: String,
      // smin: [1000, 'Bio must be greater than 100 words'],
   },
   chatbot: Array,
   connections: [{
      type: ObjectId,
      ref: "User"
   }],
   requests: [{
      type: ObjectId,
      ref: "Request"
   }],
   regno: {
      type: String,
      unique: true,
      max: 50,
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
