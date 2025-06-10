import { Request, Response, NextFunction } from 'express';
import {
    loginService,
    logoutService,
    registerService,
    resetPasswordService,
} from '../services/authServices.js';
import {
    CreatedResponse,
    OkResponse,
} from '../../../utils/responses/SuccessResponse.js';

export async function registerController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { username, email, password } = req.body;

        await registerService(username, email, password);

        const response = new CreatedResponse(
            'User has been created successfully.',
            null
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        next(error);
    }
}

export async function loginController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { email, password } = req.body;

        const result = await loginService(email, password);

        const response = new OkResponse(
            'User has been authenticated successfully.',
            {
                accessToken: result.accessToken,
            }
        );

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            maxAge: 14 * 24 * 60 * 60 * 1000,
        });

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        next(error);
    }
}

export async function logoutController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { refreshToken } = req.cookies;

        await logoutService(refreshToken);

        const response = new OkResponse(
            'User has been disconnected successfully.',
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

export async function resetPasswordController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { email } = req.body;

        await resetPasswordService(email);

        const response = new OkResponse(
            'User email received new password successfully.',
            null
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        next(error);
    }
}
