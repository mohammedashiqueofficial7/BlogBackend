const express = require("express");
const router = express.Router();
const multer = require("multer");
const Blog = require("../Usermodel/blogmodel");
var path = require("path");
const jwt = require("jsonwebtoken");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});

var upload = multer({ storage: storage });

router.post("/uploadblog", upload.single("image"), async (req, res) => {
  const { title, description, category } = req.body;
  const decoded = jwt.verify(req.headers.authorization.slice(7), "password");
  if (!decoded) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  console.log(req.body);
  const newblog = new Blog({
    image: req.file?.filename || undefined,
    title,
    description,
    category,
    userid: decoded.id,
  });
  await newblog.save();

  res.json({ message: " Successful" });
});

router.get("/getblogs", async (req, res) => {
  const search = req.query.search || "";
  const data = await Blog.find({
    $or: [
      { title: { $regex: search, $options: "i" } },
      { subtitle: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ],
    deleted: { $ne: true },
  });
  res.json(data);
});

router.get("/viewblog/:id", async (req, res) => {
  const data = await Blog.findOne({
    deleted: { $ne: true },
    _id: req.params.id,
  });
  res.json(data);
});

router.get("/viewblog3", async (req, res) => {
  const limit = 3;
  const data = await Blog.find({ deleted: { $ne: true } })
    .limit(limit)
    .exec();
  res.json(data);
});

router.get("/viewblog4/", async (req, res) => {
  const data = await Blog.find({ deleted: { $ne: true } }).skip(3);
  res.json(data);
});

router.get("/getsuggestions/:id", async (req, res) => {
  const currentblog = await Blog.findById(req.params.id);
  if (!currentblog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  const category = currentblog.category
    .toLowerCase()
    .trim()
    .split(",")
    .join("|");
  const data = await Blog.find({
    category: { $regex: category, $options: "i" },
    _id: { $ne: req.params.id },
    deleted: { $ne: true },
  })
    .limit(3)
    .exec();
  res.json(data);
});
router.get("/image", async (req, res) => {
  await fetch("https://api.unsplash.com/photos/random", {
    headers: {
      Authorization: "Client-ID gY7oJRDhr2nkSKzDy9UTYgyKTf0fvp-AvNY0gf0La4E",
    },
  }).then((response) =>
    response.json().then((data) => {
      
      // fetch image data
      fetch(data.urls.raw)
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
          res.writeHead(200, {
            "Content-Type": "image/jpeg"
          });
          res.end(Buffer.from(buffer));
        });
    })
  );
});
module.exports = router;
