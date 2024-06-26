
const errorHandler = function(res, error, message = error.message, statusCode = 500) {
    console.error(`(${statusCode}) ${message}:`, error);
    res.status(statusCode).json({ message });
};

export default errorHandler;
