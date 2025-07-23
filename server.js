require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 6000;

// Enable CORS for all origins (or specify your frontend origin instead of "*")
app.use(cors());

// Middleware
app.use(express.json());

// Basic Route
app.get("/", (req, res) => {
  res.send("Server is running on port 6000");
});

// POST /api/contact - Send Contact Form
app.post("/api/contact", async (req, res) => {
  const { yourName, yourEmail, subject, message } = req.body || {};

  if (!yourName || !yourEmail || !subject || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: "bilaljee684@gmail.com",
    subject: `Contact Form Submission: ${subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${yourName}</p>
      <p><strong>Email:</strong> ${yourEmail}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
});

// Test Route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the API!" });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
