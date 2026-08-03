const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "Something went wrong on our side. Internal Server Error." : err.message;

  // Log 500 errors for internal inspection
  if (statusCode === 500) {
    console.error("💥 SYSTEM ERROR DETECTED:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;