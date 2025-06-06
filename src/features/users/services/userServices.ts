import { JWT_CONFIG } from '../../../constants/jwtConstants.js';
import {
    createUser,
    fetchUserByEmail,
    fetchUserById,
    isEmailUnavailable,
    isUsernameUnavailable,
    setPasswordByUserId,
    setRefreshTokenById,
    updateUserByUserId,
} from '../../../models/user/userModels.js';
import { UserDB } from '../../../models/user/userModelsValidation.js';
import {
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} from '../../../utils/errors/ClientError.js';
import { isUndefined } from '../../../utils/validation/genericValidation.js';
import {
    hashPassword,
    validateEmail,
    validatePassword,
    validateUsername,
} from '../../authentication/validations/authValidation.js';

export async function fetchUserService(
    userId: number | undefined
): Promise<UserDB> {
    const newUserId = userId;
    if (isUndefined(newUserId)) {
        throw new UnauthorizedError('The user id is not valid !');
    }

    const user = await fetchUserById(newUserId);
    if (!user) {
        throw new NotFoundError('User has not been found in database !');
    }

    return user;
}

export async function updateUserService(
    userId: number | undefined,
    username: any,
    email: any
): Promise<void> {
    const newUserId = userId;
    if (isUndefined(newUserId)) {
        throw new UnauthorizedError('The user id is not valid !');
    }

    const user = await fetchUserById(newUserId);
    if (!user) {
        throw new NotFoundError('User has not been found in database !');
    }

    const newUsername = validateUsername(username);
    const newEmail = validateEmail(email);

    const dbUsername = await isUsernameUnavailable(newUsername);
    if (dbUsername) {
        throw new ConflictError('Username is not available !');
    }

    const dbEmail = await isEmailUnavailable(newEmail);
    if (dbEmail) {
        throw new ConflictError('Email is not available !');
    }

    // The naming structure for model function lack consistency (e.g: sometime with and without "BySomething"...)
    await updateUserByUserId(newUsername, newEmail, user.id);
}

export async function changePasswordService(
    userId: number | undefined,
    password: any
): Promise<void> {
    const newUserId = userId;
    if (isUndefined(newUserId)) {
        throw new UnauthorizedError('The user id is not valid !');
    }

    const user = await fetchUserById(newUserId);
    if (!user) {
        throw new NotFoundError('User has not been found in database !');
    }

    const newPassword = validatePassword(password);
    const hashedPassword = await hashPassword(newPassword);

    await setPasswordByUserId(hashedPassword, user.id);
}
