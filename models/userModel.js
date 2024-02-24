const mongoose = require("mongoose");
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema({

   //common
   name: {
      type: String,
      required: [true, 'Please enter name'],
      min: 3,
      max: 20,
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
      required:true,
   },
   image: {
      data: Buffer,
      contentType: String
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

   //user
   lawyers: Array,

   //lawyer
   regno: {
      type: String,
      unique: true,
      max: 50,
   },
   fields: Array,
   tags: Array,
   users: Array,
});


module.exports = mongoose.model("Users", userSchema);
