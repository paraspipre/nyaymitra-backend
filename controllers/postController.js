const fs = require("fs")
const Post = require("../models/postModel")
const formidable = require('formidable');
const { asyncHandler } = require("../utils/asyncHandler");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");


module.exports.createPost = asyncHandler(async (req, res) => {
   const imageLocalPath = req.file?.path
   console.log(imageLocalPath, "fsfs")

   if (!imageLocalPath) {
      throw new ApiError(400, "Image file is missing")
   }

   const image = await uploadOnCloudinary(imageLocalPath)

   if (!image.url) {
      throw new ApiError(400, "Error while uploading on image")

   }
   const { title, desc } = req.body

   const post = new Post()
   post.title = title
   post.author = req?.profile?._id
   post.desc = desc
   post.image = image.url
   await post.save()
   

   return res
      .status(200)
      .json(
         new ApiResponse(200, post, "Post created successfully")
      )
})


module.exports.getAllPosts = async (req, res, next) => {
   try {

      const posts = await Post.find()
         .sort({ createdAt: -1 }) 
         .populate("author", "name image") 
         .exec()
      return res.status(200).json(posts);
   } catch (err) {
      return res.status(500).json({ success: false, error: "Server Error" });
   }
};
