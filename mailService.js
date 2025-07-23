// mailService.js

const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send a generic email
 */
async function sendEmail({ to, subject, text = "", html = "", from }) {
  const mailOptions = {
    from: from || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error(`Error sending email: ${error.message}`);
  }
}

/**
 * Send OTP Email
 */
async function sendOtp(to, otp) {
  return sendEmail({
    to,
    subject: "Your OTP Code",
    html: `<p>Your OTP code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
  });
}

/**
 * Send Reset Password Email
 */
async function sendResetPasswordLink(email, link) {
  return sendEmail({
    to: email,
    subject: "Reset Your Password",
    html: `
      <p>You requested to reset your password.</p>
      <p>Click the link below to create a new one:</p>
      <a href="${link}">${link}</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  });
}

module.exports = {
  sendEmail,
  sendOtp,
  sendResetPasswordLink,
};
