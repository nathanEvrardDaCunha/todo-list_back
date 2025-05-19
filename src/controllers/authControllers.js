import {
    registerUser,
    loginUser,
    logoutUser,
} from '../services/authServices.js';

// TO-CONSIDER: Implement small fixed windows limiter (prevent spam) ?
// TO-CONSIDER: Add a middleware, or something else, to verify the json body is valid (e.g: register request body not undefined and size of 3) ?
// TO-DO: Enable CORS to accept cookies
// TO-CONSIDER: Add 'secure: true' for HTTPS for anything related to cookies ? (e.g: res.cookie / res.clearCookies ?)
// TO-CONSIDER: Add 'sameSite: strict' for something for anything related to cookies ? (e.g: res.cookie / res.clearCookies ?)

// TO-CONSIDER: Replace every res.status magic number by HTTP_CONSTANT ?

async function postRegister(req, res, next) {
    try {
        const { username, email, password } = req.body;
        await registerUser(username, email, password);
        res.status(200).json({
            status: `success`,
            message: `The user has been registered successfully.`,
        });
    } catch (error) {
        next(error);
    }
}

async function postLogin(req, res, next) {
    try {
        const { email, password } = req.body;
        const loginResponse = await loginUser(email, password);
        // Fix the magic numbers ???
        res.cookie('refreshToken', loginResponse.refreshToken, {
            httpOnly: true,
            maxAge: 14 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            status: `success`,
            message: `The user has been logged successfully.`,
            accessToken: loginResponse.accessToken,
            userId: loginResponse.userId,
        });
    } catch (error) {
        next(error);
    }
}

async function postLogout(req, res, next) {
    try {
        const refreshToken = req.cookies.refreshToken;
        await logoutUser(refreshToken);
        res.clearCookie('refreshToken', {
            httpOnly: true,
            maxAge: 0,
        });
        res.status(200).json({
            status: `success`,
            message: `The user has been logged out successfully.`,
        });
    } catch (error) {
        next(error);
    }
}

export { postRegister, postLogin, postLogout };
