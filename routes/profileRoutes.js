const express = require("express");
const router = express.Router();
const User = require("../models/user")
const Post = require("../models/post");

router.get("/user:id",(req,res,next)=>{
  if(req.session.userId)
  {
    if(req.session.userId == req.params.Id)
      req.session.vId = req.session.userId;
    else
      req.session.vId =req.params.id;
      let posts=null;
      User.findById(req.session.vId,(err,vUser)=>{
        if(err)
          return next(err);
        else
        {
            User.findById(req.session.userId,(err,user)=>{
              Post.find({postedBy:req.params.id}).sort({_id:-1}).exec((err,post)=>{
                let posts = post;
                res.render("profile",{user,posts,vUser});
              });
            });
        }
      });
    }
  else{
    res.redirect("/login");
  }
});

router.post("/user:id/post",(req,res,next)=>{
  let post = {
    postedBy:req.session.userId,
    text:req.body.post,
    likes:0,
    publishedAt:Date.now()
  };

  Post.create(post,(err,post)=>{
    if(err)
      return next(err);
    else
      res.redirect(`/profile/user${req.session.userId}`);
  });

});

router.post("/user:id/post:postId",(req,res,next)=>{
  User.findUser(req.params.id,(err,user)=>{
    if(err||!user)
      return next(err);
    else
    {
      let comment = {
        postedBy:user._id,
        name:user.name,
        pic:user.profilePicture,
        text:req.body.commentText,
        time:Date.now()
      };
      Post.findById(req.params.postId,(err,post)=>{
        if(err)
          return next(err);
        else{
          post.comments.push(comment);
          Post.findByIdAndUpdate(post._id,post,(err,result)=>{
            if(err)
              return next(err);
            else
              return res.redirect(`/profile/user${req.params.id}`);
          });
        }
      });
    }
  });
});

router.get("/user:id/post:postId/delete",(req,res,next)=>{
  Post.findByIdAndDelete(req.params.postId).exec((err,result)=>{
    if(err)
      return next(err);
    else
    return res.redirect(`/profile/user${req.session.userId}`);
  });
});

router.get("/user:id/post:postId/like",(req,res,next)=>{
  User.findById(req.session.userId,(err,user)=>{
    if(err)
      return next(err);
    else{
      Post.findById(req.params.postId,(err,post)=>{
        if(err)
          return next(err);
        else{
          var likedBy={
            likerId:user._id,
            name:user.name,
            likedAt:Date.now()
          };
          post.likes = post.likes + 1;
          post.likedBy.push(likedBy);
          Post.findByIdAndUpdate(req.params.postId,post,(err,result)=>{
            if(err)
              return next(err);
            else
              return res.redirect(`/profile/user${req.params.id}`);
          });
        }
      });
    }
  });
});



module.exports = router;