const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs/promises");

const templatesDir = path.join(__dirname, "..", "..", "emails");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function renderTemplate(name, data = {}) {
  const file = path.join(templatesDir, name);
  let html = await fs.readFile(file, "utf8");
  Object.keys(data).forEach((k) => {
    html = html.replace(new RegExp(`{{${k}}}`, "g"), data[k]);
  });
  return html;
}

exports.sendMail = async ({ to, subject, html }) => {
  return transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, html });
};

exports.sendWelcomeEmail = async (user) => {
  const html = await renderTemplate("welcome.html", { firstName: user.firstName });
  return exports.sendMail({ to: user.email, subject: "Welcome", html });
};

exports.sendVerifyEmail = async (user, token) => {
  const verifyUrl = `${process.env.APP_URL}/verify/${token}`;
  const html = await renderTemplate("verify-email.html", { firstName: user.firstName, verifyUrl });
  return exports.sendMail({ to: user.email, subject: "Verify your email", html });
};

exports.sendResetPasswordEmail = async (user, token) => {
  const url = `${process.env.APP_URL}/reset-password/${token}`;
  const html = await renderTemplate("reset-password.html", { firstName: user.firstName, url });
  return exports.sendMail({ to: user.email, subject: "Reset your password", html });
};
