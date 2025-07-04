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

    let decoded: string | jwt.JwtPayload;
    try {
        decoded = jwt.verify(newRefreshToken, JWT_CONFIG.REFRESH_TOKEN);
    } catch (error) {
        throw new UnauthorizedError(
            'User token has expired and need to sign-in again !'
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

    const accessToken = jwt.sign({ id: user.id }, JWT_CONFIG.ACCESS_TOKEN, {
        expiresIn: '5m',
    });

    return accessToken;
}
