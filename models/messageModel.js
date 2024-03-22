const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema
const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String },
      file: {
        type: String
      }
    },
    users: [
      {
        type: ObjectId,
        ref: 'User'
      }
    ],
    sender: {
      type: ObjectId,
      ref: 'User',
      required:true
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", MessageSchema);
