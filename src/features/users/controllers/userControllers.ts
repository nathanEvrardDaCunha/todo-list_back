import { Request, Response, NextFunction } from 'express';
import { OkResponse } from '../../../utils/responses/SuccessResponse.js';
import {
    changePasswordService,
    deleteUserService,
    fetchUserService,
    updateUserService,
} from '../services/userServices.js';

export async function fetchUserController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.id;

        const result = await fetchUserService(userId);

        const response = new OkResponse(
            'User has been fetched successfully.',
            result
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        next(error);
    }
}

export async function updateUserController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.id;
        const { username, email } = req.body;

        await updateUserService(userId, username, email);

        const response = new OkResponse(
            'User has been updated successfully.',
            null
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        next(error);
    }
}

export async function deleteUserController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.id;

        await deleteUserService(userId);

        const response = new OkResponse(
            'User has been deleted successfully.',
            null
        );

        res.clearCookie('refreshToken', {
            httpOnly: true,
            maxAge: 0,
        });

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        next(error);
    }
}

export async function changePasswordController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.id;
        const { password } = req.body;

        await changePasswordService(userId, password);

        const response = new OkResponse(
            'User password has been changed successfully.',
            null
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        next(error);
    }
}
