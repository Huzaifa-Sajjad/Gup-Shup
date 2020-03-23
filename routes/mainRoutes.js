const express = require("express");
const router = express.Router();
let User = require("../models/user");
const multer  = require('multer');
const path = require("path");

//Set Storage Engine
const storage = multer.diskStorage({
  destination:"public/uploads/",
  filename:function(req,file,callBack){
    callBack(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
  }
});

// Initialize the upload variable
const upload = multer({
  storage:storage
}).single("profilePicture");

router.get("/",(req,res,next)=>{
  res.render("index");
});

router.get("/register",(req,res,next)=>{
  let fixed=true;
  res.render("register",{fixed});
});

router.post("/register",(req,res,next)=>{
  if(req.body.password != req.body.confirmPassword)
  {
    let error = new Error("Passwords do not match");
    error.status = 401;
    return next(error);
  }
  else
  {
    let userData = {email:req.body.email,password:req.body.password};
    User.create(userData,(error,user)=>{
      if(error)
        return next(error);
      else
      {
        req.session.userId = user._id;
        console.log(user.name+"-->"+user._id+"--->"+req.session.userId);
        res.redirect("/welcome");
      }
    }); 
  }
});

router.get("/welcome",(req,res,next)=>{
  if(req.session.userId)
    res.render("welcome");
  else
  {
    res.redirect("/login");
  }
});

router.post("/welcome",(req,res,next)=>{
  upload(req,res,(err)=>{
    if(err)
      return next(err);
    else
    {
      console.log(req.session.userId);
      let updatedObject = {
        name:req.body.name,
        profilePicture:req.file.filename,
        description:req.body.description,
        dob:req.body.dob,
        city:req.body.city,
        country:req.body.country,
        interests:req.body.interests,
        status:req.body.status
      };
      User.findOneAndUpdate({_id:req.session.userId},updatedObject,(err,user)=>{
        if(err)
          return next(err);
        else{
          console.log("Welcome"+user.name);
          return res.redirect(`/profile/user${user._id}`);
        }
      });
    }
  });
});

router.get("/login",(req,res,next)=>{
  let fixed = true;
  res.render("signIn",{fixed});
});

router.post("/login",(req,res,next)=>{
  User.authenticate(req.body.email,req.body.password,(err,user)=>{
    if(err || !user){
      let error = new Error("Invalid Username or Password");
      error.status = 401;
      return next(error);
    }
    else{
      req.session.userId = user._id;
      res.redirect(`/profile/user${user._id}`);
    }
  });
});

router.get("/logout",(req,res,next)=>{
  if(req.session.userId)
  {
    req.session.destroy((err)=>{
      if(err)
        return next(err);
      else{
        return res.redirect("/");
      }
    });
  }else{
    return res.redirect("/");
  }
});

module.exports = router;