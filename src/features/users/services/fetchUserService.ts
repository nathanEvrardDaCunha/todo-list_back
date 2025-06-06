import {
    fetchUserById,
    setPasswordByUserId,
} from '../../../models/user/userModels.js';
import { UserDB } from '../../../models/user/userModelsValidation.js';
import {
    NotFoundError,
    UnauthorizedError,
} from '../../../utils/errors/ClientError.js';
import { isUndefined } from '../../../utils/validation/genericValidation.js';
import {
    hashPassword,
    validatePassword,
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
