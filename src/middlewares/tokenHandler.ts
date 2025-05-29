import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {
    FailedPreconditionError,
    UnauthorizedError,
} from '../utils/errors/ClientError.js';
import { JWT_CONFIG } from '../constants/jwtConstants.js';
import {
    isNumber,
    isString,
    isUndefined,
    validateAccessToken,
} from '../utils/validation/genericValidation.js';

declare module 'express-serve-static-core' {
    interface Request {
        id?: number;
    }
}

export function tokenHandler(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
        throw new UnauthorizedError(
            'Cannot proceed because authentication header is undefined !'
        );
    }

    const accessToken = authorizationHeader.split(' ')[1];
    const newAccessToken = validateAccessToken(accessToken);

    jwt.verify(
        newAccessToken,
        JWT_CONFIG.ACCESS_TOKEN,
        (
            err: jwt.VerifyErrors | null,
            decoded: string | JwtPayload | undefined
        ) => {
            if (err) {
                throw new UnauthorizedError(
                    'Cannot proceed because access token is invalid !'
                );
            }

            if (isUndefined(decoded)) {
                throw new FailedPreconditionError(
                    'The access token result should not be a string !'
                );
            }

            if (isString(decoded)) {
                throw new FailedPreconditionError(
                    'The access token result should not be a string !'
                );
            }

            if (!isNumber(decoded.id)) {
                throw new FailedPreconditionError(
                    'The decoded id result should a valid number !'
                );
            }

            req.id = decoded.id;
            next();
        }
    );
}
