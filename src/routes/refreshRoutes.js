// import jwt from 'jsonwebtoken';
// import { pool } from '../builds/database.js';
// import express from 'express';
// import cookieParser from 'cookie-parser';
// import { JWT_CONFIGURATION } from '../constants/jwt-constants.js';
// import { ClientError } from '../utils/errors/BaseError.js';
// import { HTTP_CLIENT_CODE } from '../constants/http-constants.js';

// const refreshRouter = express.Router();
// refreshRouter.use(cookieParser());

// refreshRouter.get('/refresh-token', async (req, res, next) => {
//     try {
//         const refreshToken = req.cookies.refreshToken;

//         if (!refreshToken) {
//             throw new ClientError(
//                 `Missing precondition`,
//                 `Cannot proceed because no refresh token has been provided !`,
//                 HTTP_CLIENT_CODE.FAILED_PRECONDITION
//             );
//         }

//         // At which point doest an error is throw if the refresh token is not valid anymore ?
//         // => Would allow me to throw a FAILED_PRECONDITION http status code
//         const decoded = jwt.verify(
//             refreshToken,
//             JWT_CONFIGURATION.REFRESH_TOKEN
//         );

//         const client = await pool.connect();
//         const result = await client.query(
//             'SELECT id, username, email, created_at, updated_at FROM users WHERE id = $1',
//             [decoded.id]
//         );
//         client.release();

//         if (result.rows.length === 0) {
//             throw new ClientError(
//                 `Resource not found`,
//                 `Cannot process sign-up because no user has been found !`,
//                 HTTP_CLIENT_CODE.NOT_FOUND
//             );
//         }

//         const accessToken = jwt.sign(
//             { id: result.rows[0].id },
//             JWT_CONFIGURATION.ACCESS_TOKEN,
//             { expiresIn: '5m' }
//         );

//         res.status(200).json({
//             accessToken,
//             user: result.rows[0],
//         });
//     } catch (error) {
//         next(error);
//     }
// });

// export default refreshRouter;
