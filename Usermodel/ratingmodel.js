const mongoose = require("mongoose")
const ratingSchema = mongoose.Schema({
    blogid:{type:mongoose.Schema.ObjectId,ref:"blog",required:false},
    userid:{type:mongoose.Schema.ObjectId,ref:"user",required:false},
    ratings:{type:String,required:false},
    
},{timestamps:true})
const Rating = mongoose.model("rating",ratingSchema)
module.exports=Rating