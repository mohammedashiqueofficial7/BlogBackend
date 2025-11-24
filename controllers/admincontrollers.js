const express = require("express");
const router = express.Router();
const Blog = require("../Usermodel/blogmodel");
const User = require("../Usermodel/user");
var path = require("path");
const jwt = require("jsonwebtoken");
const ratings = require("../Usermodel/ratingmodel");
const multer = require("multer");

router.post("/adminlogin", async (req, res) => {
  const { Username, password } = req.body;
  // const newadmin = await Admin.findOne({ username}).exec();

  if (Username === "admin123" && password === "password") {
    const token = jwt.sign({ admin: true }, "password"); //=secret
    res.json({ message: "Login Successful", token });
    return;
  }
  res.status(403).json({ message: "Password invalid" });
});

router.get("/dashboard", async (req, res) => {
  const usercount = await User.countDocuments();
  const blogcount = await Blog.countDocuments({deleted:{$ne:true}});
  const verifiedcount = await Blog.countDocuments({verified:true,deleted:{$ne:true}});
  const pendingcount = await Blog.countDocuments({verified:false,deleted:{$ne:true}});
  const deletingcount = await Blog.countDocuments({deleted: true});
  const ratingcount = await ratings.countDocuments();
  res.json({ usercount, blogcount,verifiedcount , pendingcount, deletingcount , ratingcount });
  
});

router.get("/userslist", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.delete("/deleteuser/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted successfully" });
});

router.get("/blogslist", async (req, res) => {
  const blogs = await Blog.find({deleted:{$ne:true}})
  res.json(blogs);
});

router.put("/verifyblog/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  blog.verified = true;
  await blog.save();
  res.json({ message: "Blog verified successfully" });
});

router.delete("/deleteblog/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) 
  {
    return res.status(404).json({ message: "Blog not found" });
  }
  blog.deleted = true;
  await blog.save();
  res.json({ message: "Blog deleted successfully" });
});

router.get("/ratingslist", async (req, res) => {
  const rating = await ratings.find().populate("blogid userid")
  res.json(rating);
});


router.delete("/deletereview/:id", async (req, res) => {
  const rated = await ratings.findById(req.params.id);
  if (!rated) 
  {
    return res.status(404).json({ message: "Rating not found" });
  }
  await ratings.findByIdAndDelete(req.params.id);
  res.json({ message: "Rating deleted successfully" });
});

    


module.exports = router;
