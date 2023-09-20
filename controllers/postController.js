const fs = require("fs")
const Post = require("../models/postModel")
const formidable = require('formidable');


module.exports.createPost = async (req, res, next) => {
   console.log("clicked")
   try {
      let form = new formidable.IncomingForm();
      form.keepExtensions = true;


      form.parse(req, async (err, fields, files) => {
         const { author, title, desc } = fields
         const post = new Post()
         post.title = title?.[0]
         post.author = author?.[0]
         post.desc = desc?.[0]

         if (files.image?.[0]) {
            if (files.image[0].size > 10000000) {
               return res.status(400).json({
                  error: 'Image should be less then 1mb in size'
               });
            }
            post.image.data = fs.readFileSync(files.image[0].filepath);
            post.image.contentType = files.image[0].mimetype;
         }
         post.save()


         res.json(post)
      })
   } catch (err) {
      console.log(err);
   }
};

module.exports.getAllPosts = async (req, res, next) => {
   try {

      Post.find().then((posts, err) => {
         if (err || !posts) {
            console.log(err)
            return res.status(400).json({
               err
            })
         }
         return res.json(posts);
      }).catch((err) => {
         console.log(err)
      })

   } catch (err) {
      console.log(err);
   }
};

module.exports.getPost = (req, res, next) => {
   try {
      const id = req.params.id;
      Post.findById(id).then((err, post) => {
         if (err || !post) {
            console.log(err)
            return res.status(404).json({
               err: "user not found"
            })
         }
         return res.json(post);
      }).catch((err) => {
         console.log(err)
      })
   } catch (err) {
      console.log(err);
   }
};

module.exports.photo = (req, res) => {
   const id = req.params.id
   Post.findById(id)
      .select('image')
      .then((post, err) => {
         if (err || !post) {
            return res.status(400).json({
               err
            });
         }
         res.set('Content-Type', post.image.contentType)
         res.send(post.image.data)
      });
};