const mongoose = require ("mongoose");

const contactSchema = new mongoose.Schema({
  firstName:{type:String,required:true} ,
  lastName:{type:String,required:true} ,
  email: { type: String, required: true },
  inquiryType:{type:String,required:false} ,
  location:{type:String,required:false} ,
  message: {type:String,required:true} ,
  date: { type: Date, default: Date.now },
});

const Contact = mongoose.model("contact",contactSchema)
module.exports=Contact