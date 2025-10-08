const mongoose = require("mongoose")
const favouriteSchema = mongoose.Schema({
    blogid:{type:mongoose.Schema.ObjectId,ref:"blog",required:false},
    userid:{type:mongoose.Schema.ObjectId,ref:"user",required:false},
    
    
},)
const Favourite = mongoose.model("favourite",favouriteSchema)
module.exports=Favourite