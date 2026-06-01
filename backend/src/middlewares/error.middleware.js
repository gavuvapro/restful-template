const AppError = require("../utils/AppError");

module.exports = (err, req, res, next) => {
  if (!err) return next();
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message, details: err.details || null });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
};
