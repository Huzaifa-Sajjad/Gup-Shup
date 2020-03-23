const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postedBy:{
    type:mongoose.Schema.ObjectId,
    required:true,
    trim:true,
  },
  text:{
    type:String,
    required:true,
    trim:true,
  },
  likes:{
    type:Number
  },
  likedBy:{
    type:Array
  },
  comments:{
    type:Array
  },
  publishedAt:{
    type:Date
  }
});

let Post = mongoose.model("post",postSchema);
module.exports = Post;