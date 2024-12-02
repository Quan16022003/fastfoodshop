export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Có lỗi xảy ra';
  
  // Log error
  console.error(`[Error] ${status} - ${message}`);
  console.error(err.stack);

  res.status(status).json({
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && {stack: err.stack})
  });
};