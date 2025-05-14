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
// Change status has string to 'isSuccess' as boolean (true or false)
// FIX: If it's 'Failure' instead of 'failure', the condition doesn't work.
// validate Things made flexible by inserting specific function for specific value in it (e.g: isEmail in validateString to test email)
// TO-DO: Validate my environment properties are defined, else, create fallback values.

async function hashPassword(plainPassword) {
    try {
        const hashedPassword = await bcrypt.hash(
            plainPassword,
            parseInt(process.env.BCRYPT_HASHING_ROUND)
        );
        return {
            status: 'success',
            message: 'Hashed password successfully.',
            value: hashedPassword,
        };
    } catch (error) {
        return {
            status: 'failure',
            message: 'Error during password hashing process !',
        };
    }
}

async function isPasswordMatch(plainPassword, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return {
            status: 'success',
            message: 'Hashed password successfully.',
            value: isMatch,
        };
    } catch (error) {
        return {
            status: 'failure',
            message: 'Error during password comparison process !',
        };
    }
}

function validateStringProperty(value, valueName, minLength, maxLength) {
    if (isUndefined(value)) {
        return {
            status: 'failure',
            message: `Cannot process undefined ${valueName} property !`,
        };
    }

    if (isNotString(value)) {
        return {
            status: 'failure',
            message: `Cannot process non-string ${valueName} property !`,
        };
    }

    if (isShorterEqualThan(value.length, minLength)) {
        return {
            status: 'failure',
            message: `Cannot process ${valueName} property shorter than ${minLength} characters !`,
        };
    }

    if (isLongerEqualThan(value.length, maxLength)) {
        return {
            status: 'failure',
            message: `Cannot process ${valueName} property longer than ${maxLength} characters !`,
        };
    }

    return {
        status: 'success',
        message: 'Validate string property successfully.',
    };
}

function validateUsername(username) {
    const minUsernameLength = 5;
    const maxUsernameLength = 50;
    const stringResponse = validateStringProperty(
        username,
        'username',
        minUsernameLength,
        maxUsernameLength
    );
    if (stringResponse.status === 'failure') {
        return stringResponse;
    }

    if (!isUsernameValid(username)) {
        return {
            status: 'failure',
            message:
                'Cannot process non-valid username ! Only letters, numbers and hyphen are allowed.',
        };
    }

    return {
        status: 'success',
        message: 'Validate username request property successfully.',
    };
}

function validateEmail(email) {
    const minEmailLength = 6;
    const maxEmailLength = 150;
    const stringResponse = validateStringProperty(
        email,
        'email',
        minEmailLength,
        maxEmailLength
    );
    if (stringResponse.status === 'failure') {
        return stringResponse;
    }

    if (!isEmail(email)) {
        return {
            status: 'failure',
            message: `Cannot process non-standard email property !`,
        };
    }

    return {
        status: 'success',
        message: 'Validate email request property successfully.',
    };
}

function validatePassword(password) {
    const minPasswordLength = 6;
    const maxPasswordLength = 200;
    const stringResponse = validateStringProperty(
        password,
        'password',
        minPasswordLength,
        maxPasswordLength
    );
    if (stringResponse.status === 'failure') {
        return stringResponse;
    }

    if (!isStrongPassword(password)) {
        return {
            status: 'failure',
            message: `Cannot process weak password ! It should have one uppercase, lowercase, number, special character, and be at least 6 characters long.`,
        };
    }

    return {
        status: 'success',
        message: 'Validate password request property successfully.',
    };
}

async function registerUser(username, email, password) {
    const usernameResponse = validateUsername(username);
    if (usernameResponse.status === 'failure') {
        return usernameResponse;
    }

    const emailResponse = validateEmail(email);
    if (emailResponse.status === 'failure') {
        return emailResponse;
    }

    const passwordResponse = validatePassword(password);
    if (passwordResponse.status === 'failure') {
        return passwordResponse;
    }

    const databaseEmail = await isEmailTaken(email);
    if (databaseEmail) {
        return {
            status: 'failure',
            message: `Cannot process sign-up because email is already present in database !`,
        };
    }

    const databaseUsername = await isUsernameTaken(username);
    if (databaseUsername) {
        return {
            status: 'failure',
            message: `Cannot process sign-up because username is already present in database !`,
        };
    }

    const hashedPassword = await hashPassword(password);
    if (hashedPassword.status === 'failure') {
        return hashedPassword;
    }

    await postUser(username, email, hashedPassword.value);

    const user = await getUserByEmail(email);

    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN, {
        expiresIn: '14d',
    });

    await updateRefreshTokenByUserId(refreshToken, user.id);

    return {
        status: 'success',
        message: 'Process user registration successfully.',
    };
}

async function loginUser(email, password) {
    const emailResponse = validateEmail(email);
    if (emailResponse.status === 'failure') {
        return emailResponse;
    }

    const passwordResponse = validatePassword(password);
    if (passwordResponse.status === 'failure') {
        return passwordResponse;
    }

    const user = await getUserByEmail(email);
    if (!user) {
        return {
            status: 'failure',
            message: `Cannot process with login because of invalid credentials !`,
        };
    }

    const passwordMatch = await isPasswordMatch(password, user.password);
    if (passwordMatch.status === 'failure' || passwordMatch.value === false) {
        return {
            status: 'failure',
            message: `Cannot process with login because of invalid credentials !`,
        };
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN, {
        expiresIn: '5m',
    });
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN, {
        expiresIn: '14d',
    });

    await updateRefreshTokenByUserId(refreshToken, user.id);

    return {
        status: 'success',
        message: 'Process user logged in successfully.',
        refreshToken: refreshToken,
        accessToken: accessToken,
    };
}

async function logoutUser(refreshToken) {
    if (!refreshToken) {
        return {
            status: 'failure',
            message: `Cannot proceed because user is already logged out or never logged before !`,
        };
    }

    await updateRefreshTokenToNull(refreshToken);

    return {
        status: 'success',
        message: 'Process user logged out successfully.',
    };
}

export { registerUser, loginUser, logoutUser };
