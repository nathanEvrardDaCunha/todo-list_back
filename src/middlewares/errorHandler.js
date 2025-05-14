// Make it possible to send not only 500 but 400, 401, 402, 403, 404...
// Make the filename, line and column work for more precise error information for debugging

function errorHandler(err, req, res, next) {
    res.status(500).json({
        error: err.message,
        filename: err.filename,
        line: err.line,
        column: err.colno,
    });
}

export default errorHandler;
