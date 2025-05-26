// TO-CONSIDER: Add a "advice" in my response to indicate to the users how he can fix his problem ?
// E.g: "Missing Refresh Token" => "Please, sign-in to your personal account."

import { ClientError } from '../utils/errors/ClientError.js';

// function errorHandler(err, req, res, next) {
//     if (err instanceof ClientError || err instanceof ServerError) {
//         res.status(err.httpCode).json({
//             name: err.name,
//             cause: err.cause,
//             stack: err.stack,
//         });
//     } else {
//         res.status(500).json({
//             name: 'External Error',
//             cause: err.message,
//             stack: err.stack,
//         });
//     }
// }

// export default errorHandler;

function errorHandler(err: any, req: any, res: any, next: any) {
    if (err instanceof ClientError) {
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
