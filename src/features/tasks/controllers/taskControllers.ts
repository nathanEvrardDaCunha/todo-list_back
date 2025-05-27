import { Request, Response, NextFunction } from 'express';
import {
    CreatedResponse,
    OkResponse,
} from '../../../utils/responses/SuccessResponse.js';
import {
    createTaskService,
    fetchTodayTasksService,
} from '../services/taskServices.js';
import { JWT_CONFIG } from '../../../constants/jwtConstants.js';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../../utils/errors/ClientError.js';

interface CreateTaskRequestBody {
    title: any;
    description: any;
    project: any;
    deadline: any;
}

export async function createTaskController(
    req: Request<{}, {}, CreateTaskRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // --- TOKEN HEADER AUTHENTICATION
        const authorizationHeader = req.headers['authorization'];
        if (!authorizationHeader) {
            throw new Error(
                'AUTHENTICATION HEADER: Cannot proceed because authentication header is undefined!'
            );
        }

        const accessToken = authorizationHeader.split(' ')[1];

        jwt.verify(accessToken, JWT_CONFIG.ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                throw new Error(
                    'AUTHENTICATION HEADER: Cannot proceed because access token is invalid !'
                );
            }
        });
        // --- TOKEN HEADER AUTHENTICATION
        const { title, description, project, deadline } = req.body;

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
        console.error(error);
        next(error);
    }
}

export async function fetchTodayTaskController(
    req: Request<{}, {}, {}, {}>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // --- TOKEN HEADER AUTHENTICATION
        // If this work => Add this to todayTask / createTask / register and every function controllers needing accessToken
        // It work
        // Only work with UnauthorizedError (401 to be precise)
        const authorizationHeader = req.headers['authorization'];
        if (!authorizationHeader) {
            throw new UnauthorizedError(
                'Cannot proceed because authentication header is undefined!'
            );
        }

        const accessToken = authorizationHeader.split(' ')[1];

        jwt.verify(accessToken, JWT_CONFIG.ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                throw new UnauthorizedError(
                    'Cannot proceed because access token is invalid !'
                );
            }
        });
        // --- TOKEN HEADER AUTHENTICATION

        // const { accessToken } = req.query;

        const result = await fetchTodayTasksService(accessToken);

        const response = new OkResponse(
            'Fetch user today task successfully.',
            result
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        console.error(error);
        next(error);
    }
}
