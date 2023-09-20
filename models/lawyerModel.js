const mongoose = require("mongoose");

const lawyerSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please enter name'],
   },
   regno: {
      type: String,
      required: [true, 'Please enter Registration Number'],
      unique: true,
      max: 50,
   },
   password: {
      type: String,
      required: [true, 'Please enter password'],
      min: [6, 'Password must be greater than 6 characters'],
   },
   image: {
      data: Buffer,
      contentType: String
   },
   phone: Number,
   date: Date,
   bio: {
      type: String,
      required: [true, 'Please enter your bio'],
      // smin: [1000, 'Bio must be greater than 100 words'],
   },
   fields: Array,
   tags: Array,
   users: Array
});

module.exports = mongoose.model("Lawyer", lawyerSchema);
