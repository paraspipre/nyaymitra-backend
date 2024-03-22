const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema
const RequestSchema = mongoose.Schema(
   {
      subject: { type: String },
      description: { type: String },
      receiver: {
         type: ObjectId,
         ref: 'User'
      },
      sender: {
         type: ObjectId,
         ref: 'User'
      },
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model("Request", RequestSchema);