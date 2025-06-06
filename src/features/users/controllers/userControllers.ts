import { Request, Response, NextFunction } from 'express';
import { OkResponse } from '../../../utils/responses/SuccessResponse.js';
import { fetchUserService } from '../services/fetchUserService.js';

export async function fetchUserController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.id;

        const result = await fetchUserService(userId);

        const response = new OkResponse('User fetched successfully.', result);

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        next(error);
    }
}
