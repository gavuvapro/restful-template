const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Op } = require("sequelize");

const User = require("../models/User");
const AppError = require("../utils/AppError");
const emailService = require("../services/email.service");
const tokenService = require("../services/token.service");

const sendResponse = (res, status, message, data = {}) =>
  res.status(status).json({ success: status < 400, message, data });

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) return next(new AppError(400, "Email already in use"));

    const hash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hash,
      verificationToken,
    });

    // send verification email (async)
    emailService.sendVerifyEmail(user, verificationToken).catch(() => {});

    sendResponse(res, 201, "Registration successful. Verification email sent.", {
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.scope(null).findOne({ where: { email } });
    if (!user) return next(new AppError(400, "Invalid credentials"));

    const match = await bcrypt.compare(password, user.password);
    if (!match) return next(new AppError(400, "Invalid credentials"));

    if (!user.isVerified)
      return next(new AppError(403, "Email not verified. Please verify first."));

    const accessToken = tokenService.generateAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = tokenService.generateRefreshToken();

    // store refresh token - for demo we'll attach to user (in prod store hashed token in DB)
    user.refreshToken = refreshToken;
    await user.save();

    sendResponse(res, 200, "Login successful", { accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) return next(new AppError(400, "Invalid or expired verification token"));

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    sendResponse(res, 200, "Email verified", { user: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
};

exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return next(new AppError(404, "User not found"));
    if (user.isVerified) return next(new AppError(400, "User already verified"));

    user.verificationToken = crypto.randomBytes(32).toString("hex");
    await user.save();
    emailService.sendVerifyEmail(user, user.verificationToken).catch(() => {});

    sendResponse(res, 200, "Verification email resent");
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return next(new AppError(404, "User not found"));

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    emailService.sendResetPasswordEmail(user, token).catch(() => {});
    sendResponse(res, 200, "Password reset email sent");
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });
    if (!user) return next(new AppError(400, "Invalid or expired reset token"));

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    sendResponse(res, 200, "Password reset successful");
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });
    const tokenService = require("../services/token.service");
    const decoded = tokenService.verifyAccessToken(token);
    const User = require("../models/User");
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User loaded", data: { user: { id: user.id, email: user.email, role: user.role } } });
  } catch (err) {
    next(err);
  }
};
