const express = require("express");
const router = express.Router();
const Comment = require("../Usermodel/commentmodel");
const jwt = require("jsonwebtoken");

router.get("/viewcomments/:id", async (req, res) => {
  // const token = req.headers.authorization.slice(7);
  try {
    // const decoded = jwt.verify(token);
    const comments = await Comment.find({
      // userid: decoded.id,
      blogid: req.params.id,
    }).populate("userid blogid");
    res.json(comments);
  } catch (e) {
    console.log(e);
    
    res.status(403).json({ message: "error",error:e });
  }
});


router.post("/addcomment/:id", async (req, res) => {
  const token = req.headers.authorization.slice(7);
  try {
    const decoded = jwt.verify(token, "password");
    const newComment = new Comment({
      blogid: req.params.id,
      userid: decoded.id,
      comment: req.body.comment,
    });
    await newComment.save();
    res.json({ message: "Comment posted successfully" });
  } catch (e) {
    res.status(403).json({ message: "error",error: e });
  }
});

router.delete("/deletecomments/:id", async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  await Comment.findByIdAndDelete(req.params.id);
  res.json({ message: "Comment deleted successfully" });
});

module.exports = router;
