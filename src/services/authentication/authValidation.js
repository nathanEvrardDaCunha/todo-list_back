import bcrypt from 'bcrypt';
import { BCRYPT_CONFIGURATION } from '../../constants/bcrypt-constants.js';
import { DB_USER } from '../../constants/database-constants.js';
import {
    isNullish,
    isString,
    isWhitespaceString,
    isShorterThan,
    isLongerThan,
    isEmailValid,
    isUsernameValid,
    isPasswordValid,
} from '../utils/propertyValidation.js';
import { ClientUnprocessableContentError } from '../../utils/errors/classes/ClientError.js';

// Console the error everywhere

// Rename the route, controller and anything everywhere

// Change the error everywhere

// Put the utils function in a utils files

// Write the JSDoc everywhere needed

/**
 * Check if password match hashed password
 *
 * @export
 * @async
 * @param {string} password
 * @param {string} hashedPassword
 * @return {Promise<boolean>}
 */
export async function isPasswordMatch(password, hashedPassword) {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Return hashed password
 *
 * @export
 * @async
 * @param {string} password
 * @return {Promise<string>}
 */
export async function hashPassword(password) {
    try {
        return await bcrypt.hash(
            password,
            parseInt(BCRYPT_CONFIGURATION.HASHING_ROUND)
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Validate value is valid string property
 *
 * @param {*} value
 * @param {string} name
 * @param {number} minSize
 * @param {number} maxSize
 * @return {void}
 */
function validateStringProperty(value, name, minSize, maxSize) {
    try {
        if (isNullish(value)) {
            throw new ClientUnprocessableContentError(
                `${name} is undefined or null !`
            );
        }

        if (!isString(value)) {
            throw new ClientUnprocessableContentError(
                `${name} is not of type string !`
            );
        }

        if (isWhitespaceString(value)) {
            throw new ClientUnprocessableContentError(`${name} is empty !`);
        }

        if (isShorterThan(value, minSize)) {
            throw new ClientUnprocessableContentError(
                `${name} should be longer than ${minSize} characters !`
            );
        }

        if (isLongerThan(value, maxSize)) {
            throw new ClientUnprocessableContentError(
                `${name} should be shorter than ${maxSize} characters !`
            );
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Validate value is a valid email
 *
 * @export
 * @param {*} email
 * @return {void}
 */
export function validateEmail(email) {
    try {
        validateStringProperty(
            email,
            'Email',
            DB_USER.MIN_EMAIL_LENGTH,
            DB_USER.MAX_EMAIL_LENGTH
        );

        if (!isEmailValid(email)) {
            throw new ClientUnprocessableContentError('Email is invalid !');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Validate value is a valid username
 *
 * @export
 * @param {*} username
 * @return {void}
 */
export function validateUsername(username) {
    try {
        validateStringProperty(
            username,
            'Username',
            DB_USER.MIN_USERNAME_LENGTH,
            DB_USER.MAX_USERNAME_LENGTH
        );

        if (!isUsernameValid(username)) {
            throw new ClientUnprocessableContentError('Username is invalid !');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Validate value is a valid password
 *
 * @export
 * @param {*} password
 * @return {void}
 */
export function validatePassword(password) {
    try {
        validateStringProperty(
            password,
            'Password',
            DB_USER.MIN_PASSWORD_LENGTH,
            DB_USER.MAX_PASSWORD_LENGTH
        );

        if (!isPasswordValid(password)) {
            throw new ClientUnprocessableContentError('Password is invalid !');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}
