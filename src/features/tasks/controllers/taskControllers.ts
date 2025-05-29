import { Request, Response, NextFunction } from 'express';
import {
    CreatedResponse,
    OkResponse,
} from '../../../utils/responses/SuccessResponse.js';
import {
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
        const accessToken = req.id;

        await createTaskService(
            title,
            description,
            project,
            deadline,
            accessToken
        );

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
        const accessToken = req.id;

        const result = await fetchTodayTasksService(accessToken);

        const response = new OkResponse(
            'Fetch user today task successfully.',
            result
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        next(error);
    }
}
