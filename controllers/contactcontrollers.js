const express = require("express");
const router = express.Router();
const Contact = require("../Usermodel/contactmodel");
// const Contact = require("../models/contactModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")

router.post("/contact/sendmessage", async (req, res) => {
  try {
    const { firstName, lastName, email, inquiryType, location, message } =
      req.body;

    if (!email || !message) {
      return res.status(400).json({ error: "Email and message are required." });
    }

    const newContact = new Contact({
      firstName,
      lastName,
      email,
      inquiryType,
      location,
      message,
    });

    await newContact.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mohammedashique995@gmail.com",
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: '"blog" <mohammedashique995@gmail.com>',
      to: ["mohammedashique995@gmail.com"],
      subject: "Hello from My blog online portal",
      html: `
       New email received from: ${firstName} ${lastName} <${email}><br/>
        Inquiry Type: ${inquiryType}<br/>
        Location: ${location}<br/>
        Message: ${message}
        please respond to the email as soon as possible.
      `,
    });
    await transporter.sendMail({
      from: '"blog" <mohammedashique995@gmail.com>',
      to: [email],
      subject: "Hello from My blog online portal",
      html: `
        Dear ${firstName},<br/>
        Thank you for reaching out to us. We have received your message and will get back to you shortly.<br/><br/>
        Here is a copy of your message:<br/>
        Inquiry Type: ${inquiryType}<br/>
        Location: ${location}<br/>
        Message: ${message}<br/><br/>
        Best regards,<br/>
        Blog Team.
      `,
    });

    res
      .status(201)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
