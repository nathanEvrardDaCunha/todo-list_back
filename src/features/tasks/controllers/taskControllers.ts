import { Request, Response, NextFunction } from 'express';
import {
    CreatedResponse,
    OkResponse,
} from '../../../utils/responses/SuccessResponse.js';
import {
    completeSingleTaskService,
    createTaskService,
    fetchTodayTasksService,
} from '../services/taskServices.js';

export async function createTaskController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { title, description, project, deadline } = req.body;
        const userId = req.id;

        await createTaskService(title, description, project, deadline, userId);

        const response = new CreatedResponse('Create task successfully.', null);

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        next(error);
    }
}

export async function fetchTodayTaskController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.id;

        const result = await fetchTodayTasksService(userId);

        const response = new OkResponse(
            'Fetch user today task successfully.',
            result
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        next(error);
    }
}

export async function completeSingleTaskController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const taskId = req.params.id;

        await completeSingleTaskService(taskId);

        const response = new OkResponse(
            `Complete task n-${taskId} successfully.`,
            null
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}
