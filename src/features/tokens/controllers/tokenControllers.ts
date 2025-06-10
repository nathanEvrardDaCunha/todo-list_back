import { Request, Response, NextFunction } from 'express';
import { OkResponse } from '../../../utils/responses/SuccessResponse.js';
import { refreshTokenService } from '../services/tokenServices.js';

export async function refreshTokenController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { refreshToken } = req.cookies;

        const result = await refreshTokenService(refreshToken);

        const response = new OkResponse(
            'Access token ahs been updated successfully.',
            result
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error: unknown) {
        next(error);
    }
}
