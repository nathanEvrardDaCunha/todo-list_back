import { NextFunction, Request, Response } from 'express';
import { ClientError } from '../utils/errors/ClientError.js';

export default function errorHandler(
    err: ClientError | Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof ClientError) {
        console.log('HANDLED Error:');
        console.error(err);

        res.status(err.httpCode).json({
            name: err.name,
            cause: err.cause,
            stack: err.stack,
        });
    } else {
        console.log('NON-HANDLED Error:');
        console.error(err);

        res.status(500).json({
            name: 'External Error',
            cause: err.message,
            stack: err.stack,
        });
    }
}
