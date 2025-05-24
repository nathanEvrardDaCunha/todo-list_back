import { ClientError } from '../utils/errors/classes/ClientError.js';
import { ServerError } from '../utils/errors/classes/ServerError.js';

// TO-CONSIDER: Add a "advice" in my response to indicate to the users how he can fix his problem ?
// E.g: "Missing Refresh Token" => "Please, sign-in to your personal account."

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
