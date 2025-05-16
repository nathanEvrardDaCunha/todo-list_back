import {
    isEmailTaken,
    isUsernameTaken,
    postUser,
    getUserByEmail,
    updateRefreshTokenByUserId,
    updateRefreshTokenToNull,
} from '../models/authModels.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { DB_USER } from '../constants/database-constants.js';

dotenv.config();

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
// validate Things made flexible by inserting specific function for specific value in it (e.g: isEmail in validateString to test email)
// TO-DO: Validate my environment properties are defined, else, create fallback values.

async function isPasswordMatch(plainPassword, hashedPassword) {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        throw error;
    }
}

function modernStringValidation(value, valueName, minLength, maxLength) {
    try {
        if (isUndefined(value)) {
            throw new Error(`Cannot process undefined ${valueName} property !`);
        }

        if (isNotString(value)) {
            throw new Error(
                `Cannot process non-string ${valueName} property !`
            );
        }

        if (isShorterEqualThan(value.length, minLength)) {
            throw new Error(
                `Cannot process ${valueName} property shorter than ${minLength} characters !`
            );
        }

        if (isLongerEqualThan(value.length, maxLength)) {
            throw new Error(
                `Cannot process ${valueName} property longer than ${maxLength} characters !`
            );
        }
    } catch (error) {
        throw error;
    }
}

function validateUsername(username) {
    try {
        modernStringValidation(
            username,
            'username',
            DB_USER.MIN_USERNAME_LENGTH,
            DB_USER.MAX_USERNAME_LENGTH
        );

        if (!isUsernameValid(username)) {
            throw new Error(
                `Cannot process non-valid username ! Only letters, numbers and hyphen are allowed.`
            );
        }
    } catch (error) {
        throw error;
    }
}

function validatePassword(password) {
    try {
        modernStringValidation(
            password,
            'password',
            DB_USER.MIN_PASSWORD_LENGTH,
            DB_USER.MAX_PASSWORD_LENGTH
        );

        if (!isStrongPassword(password)) {
            throw new Error(
                `Cannot process weak password ! It should have one uppercase, lowercase, number, special character, and be at least 6 characters long.`
            );
        }
    } catch (error) {
        throw error;
    }
}

function validateEmail(email) {
    try {
        modernStringValidation(
            email,
            'email',
            DB_USER.MIN_EMAIL_LENGTH,
            DB_USER.MAX_EMAIL_LENGTH
        );

        if (!isEmail(email)) {
            throw new Error(`Cannot process non-standard email property !`);
        }
    } catch (error) {
        throw error;
    }
}

async function hashPassword(plainPassword) {
    try {
        return await bcrypt.hash(
            plainPassword,
            parseInt(process.env.BCRYPT_HASHING_ROUND)
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
            throw new Error(
                `Cannot process sign-up because email is already present in database !`
            );
        }

        const databaseUsername = await isUsernameTaken(username);
        if (databaseUsername) {
            throw new Error(
                `Cannot process sign-up because username is already present in database !`
            );
        }

        const hashedPassword = await hashPassword(password);

        await postUser(username, email, hashedPassword);

        const user = await getUserByEmail(email);
        // Maybe useless because we call postUser the line above ?
        if (!user) {
            throw new Error(
                `Cannot process sign-up because not user has been found !`
            );
        }

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN,
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
            throw new Error(
                `Cannot process sign-in because not user has been found !`
            );
        }

        const passwordMatch = await isPasswordMatch(password, user.password);
        if (!passwordMatch) {
            throw new Error(
                `Cannot process sign-in because of invalid credentials !`
            );
        }

        const accessToken = jwt.sign(
            { id: user.id },
            process.env.ACCESS_TOKEN,
            {
                expiresIn: '5m',
            }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN,
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
        throw error;
    }
}

async function logoutUser(refreshToken) {
    try {
        if (!refreshToken) {
            throw new Error(
                `Cannot proceed because user is already logged out or never logged before !`
            );
        }

        await updateRefreshTokenToNull(refreshToken);
    } catch (error) {
        throw error;
    }
}

export { registerUser, loginUser, logoutUser };
