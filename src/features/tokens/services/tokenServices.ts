import { JWT_CONFIG } from '../../../constants/jwtConstants.js';
import { fetchUserById } from '../../../models/user/userModels.js';
import {
    FailedPreconditionError,
    NotFoundError,
    UnauthorizedError,
} from '../../../utils/errors/ClientError.js';
import {
    isNumber,
    isString,
    validateRefreshToken,
} from '../../../utils/validation/genericValidation.js';
import jwt from 'jsonwebtoken';

export async function refreshTokenService(refreshToken: any): Promise<string> {
    if (!refreshToken) {
        throw new UnauthorizedError('Necessary token not found !');
    }

    const newRefreshToken = validateRefreshToken(refreshToken);

    // If this work, I'll need to add it to other jwt usage case
    // => It work, time to make the shift I guess
    let decoded: string | jwt.JwtPayload;
    try {
        decoded = jwt.verify(newRefreshToken, JWT_CONFIG.REFRESH_TOKEN);
    } catch (error) {
        throw new UnauthorizedError(
            'JWT refresh token expired => USer need to logout and login again to generate a new one !'
        );
    }

    if (isString(decoded)) {
        throw new FailedPreconditionError(
            'The refresh token result should not be a string !'
        );
    }

    if (!isNumber(decoded.id)) {
        throw new FailedPreconditionError(
            'The decoded id result should a valid number !'
        );
    }

    const user = await fetchUserById(decoded.id);
    if (!user) {
        throw new NotFoundError('User has not been found in database !');
    }

    // Change back to 5m when testing is done.
    const accessToken = jwt.sign({ id: user.id }, JWT_CONFIG.ACCESS_TOKEN, {
        expiresIn: '5m',
    });

    return accessToken;
}
