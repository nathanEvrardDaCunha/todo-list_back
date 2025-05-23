import { HTTP_SUCCESS_CODE } from '../constants/http-constants.js';
import { updateAccessToken } from '../services/tokenServices.js';

// Rename every function of every routes, controllers... to something like 'refreshAccessTokenRoute', 'refreshAccessTokenController' ?
async function refreshAccessToken(req, res, next) {
    try {
        const { refreshToken } = req.cookies;

        console.log(req.cookies);

        console.log(refreshToken);

        const tokenResponse = await updateAccessToken(refreshToken);

        // Is status "OK" the most relevant one ?
        res.status(HTTP_SUCCESS_CODE.OK).json({
            status: 'success',
            message: 'The access token has been updated.',
            accessToken: tokenResponse.accessToken,
        });
    } catch (error) {
        next(error);
    }
}

export { refreshAccessToken };
