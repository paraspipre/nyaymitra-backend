const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
   {
      title: {
         type: String,
         required: true
      },
      author: {
         type: String,
         required: true
      },
      desc: {
         type: String,
      },
      image: {
         data: Buffer,
         contentType: String
      },
      vote: {
         type: Number
      },
      comment: {
         author: {
            type: String,
         },
         text: {
            type: String,
         },
         vote: {
            type: Number
         },
      }
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model("Post", PostSchema);
