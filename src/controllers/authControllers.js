import {
    registerService,
    loginService,
    logoutService,
} from '../services/authentication/authServices.js';
import {
    SuccessCreatedResponse,
    SuccessOkResponse,
    SuccessNoContentResponse,
} from '../utils/responses/classes/SuccessResponse.js';

// TO-CONSIDER: Implement small fixed windows limiter (prevent spam) ?
// TO-CONSIDER: Add a middleware, or something else, to verify the json body is valid (e.g: register request body not undefined and size of 3) ?

/**
 * Handle the HTTP request and response during user creation.
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {Promise<Void>}
 */
export async function registerController(req, res, next) {
    try {
        const { username, email, password } = req.body;

        await registerService(username, email, password);

        const response = new SuccessCreatedResponse(
            'Create user successfully.',
            null
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}

/**
 * Handle the HTTP request and response during user authentication.
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {Promise<Void>}
 */
export async function loginController(req, res, next) {
    try {
        const { email, password } = req.body;

        const result = await loginService(email, password);

        const response = new SuccessOkResponse(
            'Authenticate user successfully.',
            {
                accessToken: result.accessToken,
            }
        );

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            maxAge: 14 * 24 * 60 * 60 * 1000,
        });

        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}

/**
 * Handle the HTTP request and response during user disconnection.
 *
 * @export
 * @async
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {Promise<Void>}
 */
export async function logoutController(req, res, next) {
    try {
        const { refreshToken } = req.cookies;

        await logoutService(refreshToken);

        const response = new SuccessNoContentResponse(
            'Disconnect user successfully.'
        );

        res.clearCookie('refreshToken', {
            httpOnly: true,
            maxAge: 0,
        });

        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}
