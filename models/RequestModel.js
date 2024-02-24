const mongoose = require("mongoose");

const RequestSchema = mongoose.Schema(
   {
      sub: { type: String },
      desc: { type: String },
      fir: {
         data: Buffer,
         contentType: String
      },
      users: [{
         type: ObjectId,
         ref: 'User'
      }],
      sender: {
         type: ObjectId,
         ref: 'User'
      },
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model("Messages", RequestSchema);