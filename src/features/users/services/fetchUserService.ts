import { fetchUserById } from '../../../models/user/userModels.js';
import { UserDB } from '../../../models/user/userModelsValidation.js';
import {
    NotFoundError,
    UnauthorizedError,
} from '../../../utils/errors/ClientError.js';
import { isUndefined } from '../../../utils/validation/genericValidation.js';

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
