// Make it possible to send not only 500 but 400, 401, 402, 403, 404...
// Make the filename, line and column work for more precise error information for debugging

import { ClientError, ServerError } from '../utils/BaseError.js';

function errorHandler(err, req, res, next) {
    if (err instanceof ClientError || err instanceof ServerError) {
        res.status(err.httpCode).json({
            name: err.name,
            cause: err.cause,
            stack: err.stack,
        });
    } else {
        res.status(500).json({
            name: 'External Error',
            cause: err.message,
            stack: err.stack,
        });
    }
}

export default errorHandler;
