import { Request, Response, NextFunction } from 'express';
import { sendContactMessageService } from '../services/contactServices.js';
import { OkResponse } from '../../../utils/responses/SuccessResponse.js';

export async function sendContactMessageController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { name, email, message } = req.body;
        await sendContactMessageService(name, email, message);

        const response = new OkResponse('Message sent successfully', null);
        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}
