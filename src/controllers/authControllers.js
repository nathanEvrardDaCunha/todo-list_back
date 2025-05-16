import {
    registerUser,
    loginUser,
    logoutUser,
} from '../services/authServices.js';

// TO-CONSIDER: add a 'status' 'failure' to the error Middleware ?
// TO-CONSIDER: Make every 3 lines of conditional === failure in one ?
// TO-CONSIDER: Implement small fixed windows limiter (prevent spam) ?
// TO-CONSIDER: Add a middleware, or something else, to verify the json body is valid (e.g: register request body not undefined and size of 3) ?
// TO-CONSIDER: Make utils function to check if it's 'failure' then throw error

// TO-CONSIDER: If business logic, through error throwing, is mixed with request logic:
// => move the error handling logic inside the service files ?

// TO-DO: Enable CORS to accept cookies
// TO-CONSIDER: Add 'secure: true' for HTTPS for anything related to cookies ? (e.g: res.cookie / res.clearCookies ?)
// TO-CONSIDER: Add 'sameSite: strict' for something for anything related to cookies ? (e.g: res.cookie / res.clearCookies ?)

async function postRegister(req, res, next) {
    const { username, email, password } = req.body;
    try {
        const registerResponse = await registerUser(username, email, password);

        if (registerResponse.status === 'failure') {
            throw new Error(registerResponse.message);
        }

        res.status(200).json({
            status: `success`,
            message: `The user has been registered successfully.`,
        });
    } catch (error) {
        next(error);
    }
}

async function postLogin(req, res, next) {
    const { email, password } = req.body;
    try {
        const loginResponse = await loginUser(email, password);

        if (loginResponse.status === 'failure') {
            throw new Error(loginResponse.message);
        }

        res.cookie('refreshToken', loginResponse.refreshToken, {
            httpOnly: true,
            maxAge: 14 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            status: `success`,
            message: `The user has been logged successfully.`,
            accessToken: loginResponse.accessToken,
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
