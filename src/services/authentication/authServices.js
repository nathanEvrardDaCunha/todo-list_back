import {
    isEmailTaken,
    isUsernameTaken,
    postUser,
    getUserByEmail,
    updateRefreshTokenByUserId,
    updateRefreshTokenToNull,
} from '../../models/authModels.js';
import jwt from 'jsonwebtoken';
import { JWT_CONFIGURATION } from '../../constants/jwt-constants.js';
import {
    ClientConflictError,
    ClientNotFoundError,
    ClientUnauthorizedError,
} from '../../utils/errors/classes/ClientError.js';
import {
    hashPassword,
    validateUsername,
    validateEmail,
    validatePassword,
    isPasswordMatch,
} from './authValidation.js';

/**
 * Handle the business logic during user creation.
 *
 * @exports
 * @async
 * @param {*} username
 * @param {*} email
 * @param {*} password
 * @return {Promise<Void>}
 */
export async function registerService(username, email, password) {
    try {
        validateUsername(username);
        validateEmail(email);
        validatePassword(password);

        const databaseEmail = await isEmailTaken(email);
        if (databaseEmail) {
            throw new ClientConflictError('Email is not available !');
        }

        const databaseUsername = await isUsernameTaken(username);
        if (databaseUsername) {
            throw new ClientConflictError('Username is not available !');
        }

        const hashedPassword = await hashPassword(password);

        await postUser(username, email, hashedPassword);

        const user = await getUserByEmail(email);
        if (!user) {
            throw new ClientNotFoundError('User should exist in database !');
        }

        const refreshToken = jwt.sign(
            { id: user.id },
            JWT_CONFIGURATION.REFRESH_TOKEN,
            {
                expiresIn: '14d',
            }
        );

        await updateRefreshTokenByUserId(refreshToken, user.id);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Handle the business logic during user authentication.
 *
 * @typedef {Object} Response
 * @property {string} refreshToken
 * @property {string} accessToken
 *
 * @exports
 * @async
 * @param {*} email
 * @param {*} password
 * @return {Promise<Response>}
 */
export async function loginService(email, password) {
    try {
        validateEmail(email);
        validatePassword(password);

        const user = await getUserByEmail(email);

        if (!user) {
            throw new ClientUnauthorizedError('Invalid Credentials Email');
        }

        const passwordMatch = await isPasswordMatch(password, user.password);

        if (!passwordMatch) {
            throw new ClientUnauthorizedError('Invalid Credentials Password');
        }

        const accessToken = jwt.sign(
            { id: user.id },
            JWT_CONFIGURATION.ACCESS_TOKEN,
            {
                expiresIn: '5m',
            }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            JWT_CONFIGURATION.REFRESH_TOKEN,
            {
                expiresIn: '14d',
            }
        );

        await updateRefreshTokenByUserId(refreshToken, user.id);

        return {
            refreshToken: refreshToken,
            accessToken: accessToken,
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Handle the business logic during user disconnection.
 *
 * @export
 * @async
 * @param {*} refreshToken
 * @returns {Promise<Void>}
 */
export async function logoutService(refreshToken) {
    try {
        if (!refreshToken) {
            throw new ClientUnauthorizedError('Necessary token not found !');
        }

        await updateRefreshTokenToNull(refreshToken);
    } catch (error) {
        console.error(error);
        throw error;
    }
}
