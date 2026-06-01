const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || "1h" });

exports.verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

exports.generateRefreshToken = () => crypto.randomBytes(40).toString("hex");
