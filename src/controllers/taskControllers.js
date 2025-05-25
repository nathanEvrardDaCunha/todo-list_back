import {
    createTaskService,
    fetchTodayTaskService,
} from '../services/task/taskServices.js';
import { SuccessCreatedResponse } from '../utils/responses/classes/SuccessResponse.js';

/**
 * Handle the HTTP request and response during task creation.
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {Promise<void>}
 */
export async function createTaskController(req, res, next) {
    try {
        const { title, description, project, deadline, accessToken } = req.body;

        // const authorizationHeader = req.headers['authorization'];
        // const accessToken = authorizationHeader.split(' ')[1];

        // Rename createTaskService
        await createTaskService(
            title,
            description,
            project,
            deadline,
            accessToken
        );

        const response = new SuccessCreatedResponse(
            'Created task successfully.',
            null
        );

        // res.status(HTTP_SUCCESS_CODE.CREATED).json({
        //     status: 'success',
        //     message: 'The new task has been created successfully.',
        //     temporary: {
        //         title: taskResponse.title,
        //         description: taskResponse.description,
        //         project: taskResponse.project,
        //         deadline: taskResponse.deadline,
        //         userId: taskResponse.userId,
        //     },
        // });

        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}

/**
 * Handle the HTTP request and response during today tasks fetching.
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {Promise<void>}
 */
export async function fetTodayTaskController(req, res, next) {
    try {
        const { accessToken } = req.query;

        const result = await fetchTodayTaskService(accessToken);

        const response = new SuccessCreatedResponse(
            'Fetch today tasks successfully.',
            result
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}

// ------------------------------------
//
// Fetch-Today work => Finish the many modifications before going to Create-Task
//
// ------------------------------------
