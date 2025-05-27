import bcrypt from 'bcrypt';
import { BCRYPT_CONFIG } from '../constants/authConstants.js';
import { UnprocessableContentError } from '../../../utils/errors/ClientError.js';
import {
    isEmailValid,
    isPasswordValid,
    isUsernameValid,
    validateStringProperty,
} from '../../../utils/validation/genericValidation.js';
import { DB_USER } from '../../../builds/databaseConstants.js';

export async function isPasswordMatch(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, BCRYPT_CONFIG.HASH_ROUND);
}

export function validateEmail(email: unknown): string {
    const result = validateStringProperty(email, 'Email', DB_USER.MIN_EMAIL_LENGTH, DB_USER.MAX_EMAIL_LENGTH);
    if (!isEmailValid(result)) {
        throw new UnprocessableContentError('Email is invalid !');
    }
    return result;
}

export function validateUsername(username: unknown): string {
    const result = validateStringProperty(
        username,
        'Username',
        DB_USER.MIN_USERNAME_LENGTH,
        DB_USER.MAX_USERNAME_LENGTH
    );
    if (!isUsernameValid(result)) {
        throw new UnprocessableContentError('Username is invalid !');
    }
    return result;
}

export function validatePassword(password: unknown): string {
    const result = validateStringProperty(
        password,
        'Password',
        DB_USER.MIN_PASSWORD_LENGTH,
        DB_USER.MAX_PASSWORD_LENGTH
    );
    if (!isPasswordValid(result)) {
        throw new UnprocessableContentError('Password is invalid !');
    }
    return result;
}
