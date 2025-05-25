import jwt from 'jsonwebtoken';
import {
    getTasksFromUserId,
    postTask,
    getUserById,
} from '../../models/taskModels.js';
import {
    validateTitle,
    validateDeadline,
    validateDescription,
    validateProject,
} from './taskValidation.js';
import {
    ClientForbiddenError,
    ClientUnauthorizedError,
} from '../../utils/errors/classes/ClientError.js';
import { JWT_CONFIGURATION } from '../../constants/jwt-constants.js';

export async function createTaskService(
    title,
    description,
    project,
    deadline,
    accessToken
) {
    try {
        validateTitle(title);
        validateDescription(description);
        validateProject(project);
        validateDeadline(deadline);

        // Verify this work with and without a valid token
        let userId;
        jwt.verify(
            accessToken,
            JWT_CONFIGURATION.ACCESS_TOKEN,
            (err, decoded) => {
                if (err) {
                    // return res.status(403).json({
                    //     message: 'Cannot proceed because access token is invalid !',
                    // });

                    // Will the error throw work instead or returning it in this case ?
                    throw new ClientForbiddenError('Access token is invalid !');
                }
                userId = decoded.id;
            }
        );

        // Verify getUserById is in the 'user-table folder'
        const user = await getUserById(userId);
        if (!user) {
            throw new ClientUnauthorizedError('User not found !');
        }

        const newDeadline = new Date(deadline);
        console.log(
            `1 - User Id is of type : ${typeof userId} => If it's already a Number, delete the line below !`
        );
        const newUserId = new Number(userId);

        await postTask(title, description, project, newDeadline, newUserId);

        return {
            title: title,
            description: description,
            project: project,
            deadline: deadline,
            userId: userId,
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * @typedef Task
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string} project
 * @property {Date | string} deadline
 * @property {boolean} completed
 *
 * @export
 * @async
 * @param {*} accessToken
 * @return {Promise<Task[]>}
 */
export async function fetchTodayTaskService(accessToken) {
    try {
        let userId;
        jwt.verify(
            accessToken,
            JWT_CONFIGURATION.ACCESS_TOKEN,
            (err, decoded) => {
                if (err) {
                    throw new ClientForbiddenError('Access token is invalid !');
                }
                userId = decoded.id;
            }
        );

        // Verify getUserById is in the 'user-table folder'
        const user = await getUserById(userId);
        if (!user) {
            throw new ClientUnauthorizedError('User not found !');
        }

        const minDeadline = new Date('1990-01-01');
        const maxDeadline = new Date();
        maxDeadline.setHours(23, 59, 59, 999);

        // If your database stores dates in UTC and you want "today" based on UTC:
        // const maxDeadlineUTC = new Date();
        // maxDeadlineUTC.setUTCHours(23, 59, 59, 999);
        // console.log(`maxDeadline (UTC end of day): ${maxDeadlineUTC.toISOString()}`);
        // Use maxDeadlineUTC if that's the case. For this example, we'll use local server time.

        // JSDoc for static return
        const result = await getTasksFromUserId(
            userId,
            minDeadline,
            maxDeadline
        );

        // const tasks = result.map()

        console.log(result);

        return {
            tasks: result,
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}
