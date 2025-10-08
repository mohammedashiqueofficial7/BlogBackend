const mongoose = require("mongoose")
const commentSchema = mongoose.Schema({
    blogid:{type:mongoose.Schema.ObjectId,ref:"blog",required:false},
    userid:{type:mongoose.Schema.ObjectId,ref:"user",required:false},   
    comment:{type:String,required:false},
    
    
},{timestamps:true})
const Comment = mongoose.model("comment",commentSchema)
module.exports=Comment