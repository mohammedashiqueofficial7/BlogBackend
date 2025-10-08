const mongoose = require ("mongoose");
const adminSchema  = mongoose.Schema({
    username:{type:String,unique:true},
    password:{type:String,required:true},
})
const Admin = mongoose.model("admin",adminSchema)
module.exports =Admin