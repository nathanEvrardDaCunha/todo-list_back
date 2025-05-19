import { HTTP_SUCCESS_CODE } from '../constants/http-constants.js';
import { createTask, returnTodayTask } from '../services/taskServices.js';

// Will probably need to redo the Task in the DB to be in sync with my frontend for future features.

async function postTask(req, res, next) {
    try {
        const { title, description, project, deadline, userId } = req.body;
        const taskResponse = await createTask(
            title,
            description,
            project,
            deadline,
            userId
        );

        res.status(HTTP_SUCCESS_CODE.CREATED).json({
            status: 'success',
            message: 'The new task has been created successfully.',
            temporary: {
                title: taskResponse.title,
                description: taskResponse.description,
                project: taskResponse.project,
                deadline: taskResponse.deadline,
                userId: taskResponse.userId,
            },
        });
    } catch (error) {
        next(error);
    }
}

async function getTodayTask(req, res, next) {
    try {
        const { userId } = req.body;
        const taskResponse = await returnTodayTask(userId);

        res.status(HTTP_SUCCESS_CODE.OK).json({
            status: 'success',
            message:
                'The tasks related to a specific user have been recovered successfully.',
            tasks: taskResponse.tasks,
        });
    } catch (error) {
        next(error);
    }
}

export { postTask, getTodayTask };
