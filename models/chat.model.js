const mongoose = require("mongoose");


const aimessageSchema = new mongoose.Schema(
   {
      user: {
         type: String
      },
      ai: {
         type: String
      }
   },
   {
      timestamps: true
   }
)

module.exports.AIMessage = mongoose.model("AIMessage", aimessageSchema)

const chatSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         default: "Title"
      },
      messages: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AIMessage"
         }
      ]
   },
   {
      timestamps: true
   }
)

module.exports.Chat = mongoose.model("Chat", chatSchema)