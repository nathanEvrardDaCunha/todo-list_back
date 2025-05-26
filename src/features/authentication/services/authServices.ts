import jwt from 'jsonwebtoken';
import {
    hashPassword,
    validateUsername,
    validateEmail,
    validatePassword,
    isPasswordMatch,
    validateRefreshToken,
} from '../validations/authValidation.js';
import { JWT_CONFIG } from '../../../constants/jwtConstants.js';
import {
    createUser,
    fetchUserByEmail,
    isEmailUnavailable,
    isUsernameUnavailable,
    setRefreshTokenById,
    setRefreshTokenToNull,
} from '../../../models/userModels.js';
import { ConflictError, NotFoundError, UnauthorizedError } from '../../../utils/errors/ClientError.js';

export async function registerService(username: any, email: any, password: any): Promise<void> {
    const newUsername = validateUsername(username);
    const newEmail = validateEmail(email);
    const newPassword = validatePassword(password);

    const dbUsername = await isUsernameUnavailable(newUsername);
    if (dbUsername) {
        throw new ConflictError('Username is not available !');
    }

    const dbEmail = await isEmailUnavailable(newEmail);
    if (dbEmail) {
        throw new ConflictError('Email is not available !');
    }

    const hashedPassword = await hashPassword(newPassword);

    await createUser(newUsername, newEmail, hashedPassword);

    const user = await fetchUserByEmail(newEmail);
    if (!user) {
        throw new NotFoundError('User should exist in database !');
    }

    const refreshToken = jwt.sign({ id: user.id }, JWT_CONFIG.REFRESH_TOKEN, {
        expiresIn: '14d',
    });

    await setRefreshTokenById(refreshToken, user.id);
}

interface LoginResult {
    refreshToken: string;
    accessToken: string;
}

export async function loginService(email: any, password: any): Promise<LoginResult> {
    const newEmail = validateEmail(email);
    const newPassword = validatePassword(password);

    const user = await fetchUserByEmail(newEmail);
    if (!user) {
        throw new UnauthorizedError('Invalid Credentials !');
    }

    const passwordMatch = await isPasswordMatch(newPassword, user.password);

    if (!passwordMatch) {
        throw new UnauthorizedError('Invalid Credentials !');
    }

    const accessToken = jwt.sign({ id: user.id }, JWT_CONFIG.ACCESS_TOKEN, {
        expiresIn: '5m',
    });

    const refreshToken = jwt.sign({ id: user.id }, JWT_CONFIG.REFRESH_TOKEN, {
        expiresIn: '14d',
    });

    await setRefreshTokenById(refreshToken, user.id);

    return {
        refreshToken: refreshToken,
        accessToken: accessToken,
    };
}

// Problems ?
export async function logoutService(refreshToken: any): Promise<void> {
    if (!refreshToken) {
        throw new UnauthorizedError('Necessary token not found !');
    }

    const newRefreshToken = validateRefreshToken(refreshToken);

    await setRefreshTokenToNull(newRefreshToken);
}
