const express = require("express");
const User = require("../Usermodel/user");
const router = express.Router();
const Rating = require("../Usermodel/ratingmodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/:id", async (req, res) => {
  const token = req.headers.authorization.slice(7);
  try {
    const decoded = jwt.verify(token, "password");
    const Ratestar = await Rating.findOne({
      userid: decoded.id,
      blogid: req.params.id,
    });
    res.json(Ratestar);
  } catch (e) {
    res.status(403).json({ message: "error" });
  }
});

router.post("/:id", async (req, res) => {
  const token = req.headers.authorization.slice(7);
  try {
    const decoded = jwt.verify(token, "password");
    const { ratings } = req.body;
    const existingRating = await Rating.findOne({
      userid: decoded.id,
      blogid: req.params.id,
    });

    if (existingRating) {
      existingRating.ratings = ratings;
      await existingRating.save();
      res.json({ message: "Rating updated successfully" });
    } else {
      const newRating = new Rating({
        blogid: req.params.id,
        userid: decoded.id,
        ratings,
      });
      await newRating.save();
      res.json({ message: "Rating added successfully" });
    }
  } catch (e) {
    res.status(403).json({ message: "error" });
  }
});
module.exports = router;
