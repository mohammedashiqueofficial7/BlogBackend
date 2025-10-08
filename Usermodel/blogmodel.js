const mongoose = require ("mongoose");
const blogSchema = mongoose.Schema({
    image:{type:String,required:false},
    title:{type:String,required:true},
    subtitle:{type:String,required:false},
    description:{type:String,required:true},
    verified:{type:Boolean,default:false},
    deleted:{type:Boolean,default:false},
    category:{type:String,required:true},
},{timestamps:true})

const Blog = mongoose.model("blog",blogSchema)
module.exports = Blog