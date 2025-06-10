import {
    deleteUser,
    fetchUserById,
    isEmailUnavailable,
    isUsernameUnavailable,
    setPasswordByUserId,
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

    const finalUsername =
        username === undefined ? user.username : validateUsername(username);
    const finalEmail = email === undefined ? user.email : validateEmail(email);

    if (finalUsername !== user.username) {
        const dbUsername = await isUsernameUnavailable(finalUsername);
        if (dbUsername) {
            throw new ConflictError('Username is not available !');
        }
    }

    if (finalEmail !== user.email) {
        const dbEmail = await isEmailUnavailable(finalEmail);
        if (dbEmail) {
            throw new ConflictError('Email is not available !');
        }
    }

    await updateUserByUserId(finalUsername, finalEmail, user.id);
}

export async function deleteUserService(
    userId: number | undefined
): Promise<void> {
    const newUserId = userId;
    if (isUndefined(newUserId)) {
        throw new UnauthorizedError('The user id is not valid !');
    }

    const user = await fetchUserById(newUserId);
    if (!user) {
        throw new NotFoundError('User has not been found in database !');
    }

    await deleteUser(user.id);
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
