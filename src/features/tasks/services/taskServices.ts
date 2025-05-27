import { JWT_CONFIG } from '../../../constants/jwtConstants.js';
import {
    createTask,
    fetchUserTaskInDateRange,
} from '../../../models/task/taskModels.js';
import { TaskDB } from '../../../models/task/taskModelsValidation.js';
import { fetchUserById } from '../../../models/user/userModels.js';
import {
    FailedPreconditionError,
    NotFoundError,
    UnauthorizedError,
} from '../../../utils/errors/ClientError.js';
import {
    isNumber,
    isString,
    validateAccessToken,
} from '../../../utils/validation/genericValidation.js';
import {
    validateDeadline,
    validateDescription,
    validateProject,
    validateTitle,
} from '../validations/taskValidation.js';
import jwt, { JwtPayload } from 'jsonwebtoken';

// If your database stores dates in UTC and you want "today" based on UTC:
// const maxDeadlineUTC = new Date();
// maxDeadlineUTC.setUTCHours(23, 59, 59, 999);
// console.log(`maxDeadline (UTC end of day): ${maxDeadlineUTC.toISOString()}`);
// Use maxDeadlineUTC if that's the case. For this example, we'll use local server time.
// => In short, if there is a problem with the date, check to see if it should be in UTC or not.

export async function createTaskService(
    title: any,
    description: any,
    project: any,
    deadline: any,
    accessToken: any
): Promise<void> {
    const newTitle = validateTitle(title);
    const newDescription = validateDescription(description);
    const newProject = validateProject(project);
    const newDeadline = validateDeadline(deadline);
    const newAccessToken = validateAccessToken(accessToken);

    // If this work, I'll need to add it to other jwt usage case
    // => It work, time to make the shift I guess
    let decoded: string | JwtPayload;
    try {
        decoded = jwt.verify(newAccessToken, JWT_CONFIG.ACCESS_TOKEN);
    } catch (error) {
        throw new UnauthorizedError('JWT access token expired !');
    }

    if (isString(decoded)) {
        throw new FailedPreconditionError(
            'The access token result should not be a string !'
        );
    }

    if (!isNumber(decoded.id)) {
        throw new FailedPreconditionError(
            'The decoded id result should a valid number !'
        );
    }

    // Create function "checkUserExist" instead of fetch the user entirely each time ?
    // If I do it, I'll need to change slightly most condition like this (!user)...
    const user = await fetchUserById(decoded.id);
    if (!user) {
        throw new NotFoundError('User has not been found in database !');
    }

    // Try newDeadline as string and not as Date
    const convertedDeadline = new Date(newDeadline);
    await createTask(
        newTitle,
        newDescription,
        newProject,
        convertedDeadline,
        user.id
    );
}

export async function fetchTodayTasksService(
    accessToken: any
): Promise<TaskDB[]> {
    const newAccessToken = validateAccessToken(accessToken);

    // If this work, I'll need to add it to other jwt usage case
    // => It work, time to make the shift I guess
    let decoded: string | JwtPayload;
    try {
        decoded = jwt.verify(newAccessToken, JWT_CONFIG.ACCESS_TOKEN);
    } catch (error) {
        throw new UnauthorizedError('JWT access token expired !');
    }

    if (isString(decoded)) {
        throw new FailedPreconditionError(
            'The access token result should not be a string !'
        );
    }

    if (!isNumber(decoded.id)) {
        throw new FailedPreconditionError(
            'The decoded id result should a valid number !'
        );
    }

    // Create function "checkUserExist" instead of fetch the user entirely each time ?
    // If I do it, I'll need to change slightly most condition like this (!user)...
    const user = await fetchUserById(decoded.id);
    if (!user) {
        throw new NotFoundError('User has not been found in database !');
    }

    const minDeadline = new Date('1990-01-01');
    const maxDeadline = new Date();
    maxDeadline.setHours(23, 59, 59, 999);

    const tasks = await fetchUserTaskInDateRange(
        user.id,
        minDeadline,
        maxDeadline
    );

    return tasks;
}
