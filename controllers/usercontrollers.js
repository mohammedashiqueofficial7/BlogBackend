const express = require("express");
const nodemailer = require("nodemailer")
const router = express.Router();
const User = require("../Usermodel/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { fullname, email, phonenumber, password } = req.body;
    console.log(req.body);
    const hash = await bcrypt.hash(password, 10);
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      res.status(400).json({ message: "User already existed" });
      return;
    }
    if (password == "") {
      res.status(400).json({ message: "enter the password" });
      return;
    }
    const newuser = new User({ fullname, email, phonenumber, password: hash });
    await newuser.save();
    const token = jwt.sign({ id: newuser._id }, "password"); //=secret
    res.json({ message: " Successful", token });
  } catch (e) {
    res.status(400).json({ message: "server error", error: e });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const newuser = await User.findOne({ email }).exec();

  const ismatching = await bcrypt.compare(password, newuser?.password||"");
  if (!ismatching) {
    res.status(400).json({ message: "password incorrect / account does not have exist please register" });
    return;
  }

  const token = jwt.sign({ id: newuser._id }, "password"); //=secret
  res.json({ message: "Login Successful", token });
});

router.get("/profile", async (req, res) => {
  const token = req.headers.authorization.slice(7);
  try {
    const decoded = jwt.verify(token, "password");
    const profileuser = await User.findOne({ _id: decoded.id });
    res.json(profileuser);
  } catch (e) {
    res.status(403).json({ message: "error" });
  }
});
router.put("/profile", async (req, res) => {
  const { fullname, email, phonenumber, dateofbirth } = req.body;
  console.log(req.body);
  const token = req.headers.authorization.slice(7);
  try {
    const decoded = jwt.verify(token, "password");
    const profileuser = await User.findByIdAndUpdate(decoded.id, {
      fullname,
      email,
      phonenumber,
      dateofbirth,
    });
    res.json(profileuser);
  } catch (e) {
    console.log(e);

    res.status(400).json({ message: "Error updating user" });
  }
});

router.delete("/delete", async (req, res) => {
  const token = req.headers.authorization.slice(7);
  try {
    const decoded = jwt.verify(token, "password");
    const profileuser = await User.findByIdAndDelete(decoded.id);
    res.json(profileuser);
  } catch (e) {
    console.log(e);

    res.status(400).json({ message: "deleting account" });
  }
});
router.post("/changepassword", async (req, res) => {
  const token = req.headers.authorization.slice(7);
  try {
    const decoded = jwt.verify(token, "password");
    const profileuser = await User.findById(decoded.id);
    const { email } = req.body;
    if (profileuser.email == email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "mohammedashique995@gmail.com",
          pass: process.env.GMAIL_PASSWORD,
        },
      });
      await transporter.sendMail({
        from: '"blog" <mohammedashique995@gmail.com>',
        to: [email],
        subject: "Hello from My blog online portal",
        html:`
        Please Click below to verify
        <a href="http://localhost:4000/changepassword" style="padding:10px 20px;background-color:blue;color:white;">click here to verify</a>
        `
      });
      res.json("send")
      return
    }
    res.json("not send")
  } catch (e) {
    console.log(e);

    res.status(400).json({ message: "error sendimg email" });
  }
});

router.put("/passwordchange", async (req, res) => {
  const { password } = req.body;
  const token = req.headers.authorization.slice(7);
  try {
    const decoded = jwt.verify(token, "password");
    const hash = await bcrypt.hash(password, 10);
    const profileuser = await User.findByIdAndUpdate(decoded.id, {
      password: hash,
    });
    res.json(profileuser);
  } catch (e) {
    console.log(e);

    res.status(400).json({ message: "error updating password" });
  }
});

module.exports = router;