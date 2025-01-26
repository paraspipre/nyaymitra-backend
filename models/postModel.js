const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema

const PostSchema = mongoose.Schema(
   {
      title: {
         type: String,
         required: true
      },
      author: {
         type: ObjectId,
         ref: 'User'
      },
      desc: {
         type: String,
      },
      image: {
         type: String
      },
      vote: {
         type: Number
      }
      // comment: {
      //    author: {
      //       type: String,
      //    },
      //    text: {
      //       type: String,
      //    },
      //    vote: {
      //       type: Number
      //    },
      // }
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model("Post", PostSchema);
