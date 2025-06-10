import { Request, Response, NextFunction } from 'express';
import {
    CreatedResponse,
    OkResponse,
} from '../../../utils/responses/SuccessResponse.js';
import {
    completeTaskService,
    createTaskService,
    deleteTaskService,
    fetchTodayTasksService,
    updateTaskService,
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

        const response = new CreatedResponse(
            'Task has been created successfully.',
            null
        );

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
            'User tasks have been fetched successfully.',
            result
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        next(error);
    }
}

export async function completeTaskController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const taskId = req.params.id;

        await completeTaskService(taskId);

        const response = new OkResponse(
            `Task n-${taskId} ahs been completed successfully.`,
            null
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}

export async function deleteTaskController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const taskId = req.params.id;

        await deleteTaskService(taskId);

        const response = new OkResponse(
            `Task n-${taskId} has been deleted successfully.`,
            null
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}

export async function updateTaskController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { title, description, project, deadline } = req.body;
        const taskId = req.params.id;
        const userId = req.id;

        await updateTaskService(
            title,
            description,
            project,
            deadline,
            userId,
            taskId
        );

        const response = new OkResponse(
            `Task n-${taskId} has been updated successfully.`,
            null
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        next(error);
    }
}
