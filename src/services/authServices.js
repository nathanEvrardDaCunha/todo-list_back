import {
    isEmailTaken,
    isUsernameTaken,
    postUser,
    getUserByEmail,
    updateRefreshTokenByUserId,
    updateRefreshTokenToNull,
} from '../models/authModels.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { DB_USER } from '../constants/database-constants.js';
import { BCRYPT_CONFIGURATION } from '../constants/bcrypt-constants.js';
import { JWT_CONFIGURATION } from '../constants/jwt-constants.js';
import { ClientError } from '../utils/BaseError.js';
import { HTTP_CLIENT_CODE } from '../constants/http-constants.js';

const isUndefined = (value) => value === undefined;
const isNotString = (value) => typeof value !== 'string';
const isShorterEqualThan = (value, shorterLength) => value < shorterLength;
const isLongerEqualThan = (value, higherLength) => value > higherLength;
const isUsernameValid = (value) => /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/.test(value);
const isEmail = (value) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
const isStrongPassword = (value) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/.test(
        value
    );

// TO-CONSIDER: Add typescript without hot reload to avoid build problem ?
// TO-CONSIDER: Add test for each functions ?
// TO-CONSIDER: Move some functions into their respective, themed, files ?

// TO-CONSIDER: Check to see if every http code is relevant ?

async function isPasswordMatch(plainPassword, hashedPassword) {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        throw error;
    }
}

function validateStringProperty(value, valueName, minLength, maxLength) {
    try {
        if (isUndefined(value)) {
            throw new ClientError(
                `Invalid property`,
                `Cannot process undefined ${valueName} property !`,
                HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
            );
        }

        if (isNotString(value)) {
            throw new ClientError(
                `Invalid property`,
                `Cannot process non-string ${valueName} property !`,
                HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
            );
        }

        if (isShorterEqualThan(value.length, minLength)) {
            throw new ClientError(
                `Invalid property`,
                `Cannot process ${valueName} property shorter than ${minLength} characters !`,
                HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
            );
        }

        if (isLongerEqualThan(value.length, maxLength)) {
            throw new ClientError(
                `Invalid property`,
                `Cannot process ${valueName} property longer than ${maxLength} characters !`,
                HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
            );
        }
    } catch (error) {
        throw error;
    }
}

function validateUsername(username) {
    try {
        validateStringProperty(
            username,
            'username',
            DB_USER.MIN_USERNAME_LENGTH,
            DB_USER.MAX_USERNAME_LENGTH
        );

        if (!isUsernameValid(username)) {
            throw new ClientError(
                `Invalid property`,
                `Cannot process non-valid username ! Only letters, numbers and hyphen are allowed.`,
                HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
            );
        }
    } catch (error) {
        throw error;
    }
}

function validatePassword(password) {
    try {
        validateStringProperty(
            password,
            'password',
            DB_USER.MIN_PASSWORD_LENGTH,
            DB_USER.MAX_PASSWORD_LENGTH
        );

        if (!isStrongPassword(password)) {
            throw new ClientError(
                `Invalid property`,
                `Cannot process weak password ! It should have one uppercase, lowercase, number, special character, and be at least 6 characters long.`,
                HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
            );
        }
    } catch (error) {
        throw error;
    }
}

function validateEmail(email) {
    try {
        validateStringProperty(
            email,
            'email',
            DB_USER.MIN_EMAIL_LENGTH,
            DB_USER.MAX_EMAIL_LENGTH
        );

        if (!isEmail(email)) {
            throw new ClientError(
                `Invalid property`,
                `Cannot process non-standard email property !`,
                HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
            );
        }
    } catch (error) {
        throw error;
    }
}

async function hashPassword(plainPassword) {
    try {
        return await bcrypt.hash(
            plainPassword,
            parseInt(BCRYPT_CONFIGURATION.HASHING_ROUND)
        );
    } catch (error) {
        throw error;
    }
}

async function registerUser(username, email, password) {
    try {
        validateUsername(username);
        validateEmail(email);
        validatePassword(password);

        const databaseEmail = await isEmailTaken(email);
        if (databaseEmail) {
            throw new ClientError(
                `Conflicting property`,
                `Cannot process sign-up because email is already present in database !`,
                HTTP_CLIENT_CODE.CONFLICT
            );
        }

        const databaseUsername = await isUsernameTaken(username);
        if (databaseUsername) {
            throw new ClientError(
                `Conflicting property`,
                `Cannot process sign-up because username is already present in database !`,
                HTTP_CLIENT_CODE.CONFLICT
            );
        }

        const hashedPassword = await hashPassword(password);

        await postUser(username, email, hashedPassword);

        const user = await getUserByEmail(email);
        // Maybe useless because we call postUser the line above ?
        if (!user) {
            throw new ClientError(
                `Resource not found`,
                `Cannot process sign-up because no user has been found !`,
                HTTP_CLIENT_CODE.NOT_FOUND
            );
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
        throw error;
    }
}

async function loginUser(email, password) {
    try {
        validateEmail(email);
        validatePassword(password);

        const user = await getUserByEmail(email);
        if (!user) {
            throw new ClientError(
                `Invalid Credentials`,
                `Cannot process sign-in because of invalid credentials !`,
                HTTP_CLIENT_CODE.UNAUTHORIZED
            );
        }

        const passwordMatch = await isPasswordMatch(password, user.password);
        if (!passwordMatch) {
            throw new ClientError(
                `Invalid Credentials`,
                `Cannot process sign-in because of invalid credentials !`,
                HTTP_CLIENT_CODE.UNAUTHORIZED
            );
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
            userId: user.id,
        };
    } catch (error) {
        throw error;
    }
}

async function logoutUser(refreshToken) {
    try {
        if (!refreshToken) {
            throw new ClientError(
                `Authentication required`,
                `Cannot proceed because user is already logged out or never logged before !`,
                HTTP_CLIENT_CODE.UNAUTHORIZED
            );
        }

        await updateRefreshTokenToNull(refreshToken);
    } catch (error) {
        throw error;
    }
}

export { registerUser, loginUser, logoutUser };
