const mongoose = require ("mongoose");
const userSchema = new mongoose.Schema({
    fullname:{type:String,required:true},
    email:{type:String,unique:true},
    phonenumber:{type:String,required:true},
    password:{type:String,required:true},
    dateofbirth :{type:String,required:false}
},{
    timestamps:true
})
const User = mongoose.model("user",userSchema)
module.exports=User