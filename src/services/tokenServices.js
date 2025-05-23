import jwt from 'jsonwebtoken';
import { JWT_CONFIGURATION } from '../constants/jwt-constants.js';
import { ClientError } from '../utils/BaseError.js';
import { HTTP_CLIENT_CODE } from '../constants/http-constants.js';
import { getUserById } from '../models/tokenModels.js';

async function updateAccessToken(refreshToken) {
    try {
        console.log(refreshToken);

        if (!refreshToken) {
            throw new ClientError(
                `Missing precondition`,
                `Cannot proceed because no refresh token has been provided !`,
                HTTP_CLIENT_CODE.FAILED_PRECONDITION
            );
        }

        // Can this throw an error if the refresh token is expired ? or is this only the duty of the token middleware ?
        // In the case a error is thrown because the token is, maybe expired or, doesn't match, is it already handled ?
        const decoded = jwt.verify(
            refreshToken,
            JWT_CONFIGURATION.REFRESH_TOKEN
        );

        const result = await getUserById(decoded.id);

        if (!result) {
            throw new ClientError(
                `Resource not found`,
                `Cannot process sign-up because no user has been found !`,
                HTTP_CLIENT_CODE.NOT_FOUND
            );
        }

        const accessToken = jwt.sign(
            { id: result.id },
            JWT_CONFIGURATION.ACCESS_TOKEN,
            { expiresIn: '5m' }
        );

        // TO-DO: Change the magic number for the return status here and everywhere else
        return { accessToken: accessToken };
    } catch (error) {
        // TO-CONSIDER: print in the console of the server the error for every throw everywhere ?
        throw error;
    }
}

export { updateAccessToken };
