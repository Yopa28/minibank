const AppError = require("../utils/AppError");

function errorHandler(err, req, res, next) {
  let error = err;

  if (!(err instanceof AppError)) {
    error = new AppError(500, "Internal Server Error");
    console.error("UNEXPECTED ERROR:", err);
  }

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message
  });
}

module.exports = errorHandler;