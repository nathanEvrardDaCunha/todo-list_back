import { UnprocessableContentError } from '../../utils/errors/ClientError.js';
import {
    isDate,
    isNumber,
    isString,
} from '../../utils/validation/genericValidation.js';

export interface UserDB {
    id: number;
    username: string;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
}

function validateIsNumber(value: any, valueName: string): number {
    // Server Error because it come from Database
    if (!isNumber(value)) {
        throw new UnprocessableContentError(
            `${valueName} is not of type number !`
        );
    }
    return value;
}

function validateIsString(value: any, valueName: string): string {
    // Server Error because it come from Database
    if (!isString(value)) {
        throw new UnprocessableContentError(
            `${valueName} is not of type string !`
        );
    }
    return value;
}

function validateIsDate(value: any, valueName: string): Date {
    // Server Error because it come from Database
    if (!isDate(value)) {
        throw new UnprocessableContentError(
            `${valueName} is not of type Date !`
        );
    }
    return value;
}

export function validateUserDB(
    id: any,
    username: any,
    email: any,
    password: any,
    created_at: any,
    updated_at: any
): UserDB {
    const newId = validateIsNumber(id, 'id');
    const newUsername = validateIsString(username, 'username');
    const newEmail = validateIsString(email, 'email');
    const newPassword = validateIsString(password, 'password');
    const newCreatedAt = validateIsDate(created_at, 'created_at');
    const newUpdatedAt = validateIsDate(updated_at, 'updated_at');

    const result: UserDB = {
        id: newId,
        username: newUsername,
        email: newEmail,
        password: newPassword,
        created_at: newCreatedAt,
        updated_at: newUpdatedAt,
    };

    return result;
}
