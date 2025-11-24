const express = require("express");
const User = require("../Usermodel/user");
const router = express.Router();
const Favourite = require("../Usermodel/favouritesmodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


router.post("/addfavourites/:id", async (req, res) => {
  const token = req.headers.authorization.slice(7);
  try {
    const decoded = jwt.verify(token, "password");
    const existingFavourite= await Favourite.findOne({
      userid: decoded.id,
      blogid: req.params.id,
    });

    if (existingFavourite) {
      res.json({ message: "favourite added successfully" });
    } else {
      const newFavourite = new Favourite({
        blogid: req.params.id,
        userid: decoded.id,
      });
      await newFavourite.save();
      res.json({ message: "Favourite added successfully" });
    }
  } catch (e) {
    res.status(403).json({ message: "error" });
  }
});

router.delete("/removefavourites/:id", async (req, res) => {
  const token = req.headers.authorization.slice(7);
    try {
        const decoded = jwt.verify(token, "password");
        await Favourite.findOneAndDelete({
            userid:decoded.id,
            blogid:req.params.id
        })
        res.json({message:"Favourite removed successfully"})
    } catch(e) {
        res.status(403).json({message:"error"})
    }
});

router.get("/viewfavourites", async (req, res) => {
  const token = req.headers.authorization.slice(7);
    try {
        const decoded = jwt.verify(token, "password");
        const favourites = await Favourite.find({
            userid:decoded.id,
        }).populate('blogid');
        res.json({message:"Favourite viewed successfully",favourites})
    } catch(e) {
        res.status(403).json({message:"error"})
    }
});

router.get("/checkfavourite/:id", async (req, res) => {
    const token = req.headers.authorization.slice(7);
    try {
        const decoded = jwt.verify(token, "password");
        const existingFavourite= await Favourite.findOne({
            userid: decoded.id,
            blogid: req.params.id,
        });
        if (existingFavourite) {
            res.json({ message: "favourite exists",value:true });
        } else {
            res.json({ message: "favourite does not exist",value:false });
        }   
    } catch (e) {
        res.status(403).json({ message: "error" });
    }
});

module.exports = router;