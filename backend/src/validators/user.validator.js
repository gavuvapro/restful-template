const { body } = require("express-validator");

exports.create = [
  body("firstName").notEmpty().withMessage("First name required"),
  body("lastName").notEmpty().withMessage("Last name required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").optional().isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("role").optional().isIn(["ADMIN", "USER"]).withMessage("Invalid role"),
];
