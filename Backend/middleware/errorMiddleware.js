// Global error handler middleware (requires 4 parameters)
const globalErrorHandler = (err, req, res, next) => {
    console.error("💥 SERVER ERROR:", err);
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message || 'Something went wrong on the server.',
        error: err,
        stack: err.stack
    });
};

module.exports = globalErrorHandler;