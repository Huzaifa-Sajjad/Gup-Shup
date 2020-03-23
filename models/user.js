const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let userSchema = new mongoose.Schema({
  email:{
    type:String,
    unique:true,
    trim:true,
    required:true
  },
  password:{
    type:String,
    trim:true,
    required:true
  },
  name:{
    type:String
  },
  profilePicture:{
    type:String
  },
  description:{
    type:String
  },
  dob:{
    type:Date
  },
  city:{
    type:String
  },
  country:{
    type:String
  },
  interests:{
    type:String
  },
  status:{
    type:String
  },
  friends:{
    type:Array
  }
}); 

//hash the password before saving the data to the database
userSchema.pre('save',function(next){
  var user = this;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
        if(err)
        {
          return next(err);
        }
        else
        {
          user.password = hash;
          next();
        }
    });
  });
});

//Authenticating the user
userSchema.statics.authenticate = function(email,password,callBack){
  User.findOne({email:email}).exec((err,user)=>{
    if(err)
      return callBack(err);
    else if(!user){
      let error = new Error("No User Found");
      error.status = 401;
      return callBack(error);
    }
    else{
      // Load hash from your password DB.
      bcrypt.compare(password, user.password, function(err, res) {
          if(res === true)
            return callBack(null,user);
          else
            return callBack(err);
      });
    }
  });
}
// Finding user via its id
userSchema.statics.findUser = function(id,cb){
  User.findOne({_id:id}).exec((err,user)=>{
    if(err)
      return cb(err);
    else if(!user){
      let error = new Error("No User Found");
      error.status = 401;
      return callBack(error);
    }
    else{
      return cb(null,user);
    }
  });
}


let User = mongoose.model("User",userSchema);
module.exports = User;