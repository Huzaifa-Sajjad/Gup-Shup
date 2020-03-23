const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/",(req,res,next)=>{
  User.find({name:req.body.query},(err,user)=>{
    if(err)
      return next(err);
    else{
      res.render("search",{user});
    }
  });
});

module.exports = router;