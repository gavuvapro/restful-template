const User = require("../models/User");
const userService = require("../services/user.service");
const AppError = require("../utils/AppError");

exports.getProfile = async (req, res, next) => {
  try {
    const id = req.params.id || req.user.id;
    const user = await userService.getById(id);
    if (!user) return next(new AppError(404, "User not found"));
    res.json({ success: true, message: "User retrieved", data: { user } });
  } catch (err) {
    next(err);
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    const { page, limit, search, sortBy, order } = req.query;
    const result = await userService.list({ page: Number(page) || 1, limit: Number(limit) || 10, search, sortBy, order });
    res.json({ success: true, message: "Users listed", data: result });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return next(new AppError(400, "Email already in use"));
    const bcrypt = require("bcrypt");
    const hash = await bcrypt.hash(password || "ChangeMe123!", 10);
    const user = await User.create({ firstName, lastName, email, password: hash, role: role || "USER" });
    res.status(201).json({ success: true, message: "User created", data: { user } });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (!user) return next(new AppError(404, "User not found"));

    const allowed = ["firstName", "lastName", "email", "role"];
    allowed.forEach((k) => { if (req.body[k] !== undefined) user[k] = req.body[k]; });
    await user.save();
    res.json({ success: true, message: "User updated", data: { user } });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (!user) return next(new AppError(404, "User not found"));
    await user.destroy();
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
