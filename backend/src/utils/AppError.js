class AppError extends Error {
  constructor(statusCode = 500, message = "Internal Server Error", details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
