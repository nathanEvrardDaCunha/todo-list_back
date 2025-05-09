import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { pool } from '../builds/database.js';
import express from 'express';
import cookieParser from 'cookie-parser';

dotenv.config();

const refreshRouter = express.Router();
refreshRouter.use(cookieParser());

refreshRouter.get('/refresh-token', async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new Error(
                'Cannot proceed because no refresh token has been provided !'
            );
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

        const client = await pool.connect();
        const result = await client.query(
            'SELECT id, username, email, created_at, updated_at FROM users WHERE id = $1',
            [decoded.id]
        );
        client.release();

        if (result.rows.length === 0) {
            throw new Error(
                'Cannot proceed because no relevant user has been found !'
            );
        }

        // Generate new access token
        const accessToken = jwt.sign(
            { id: result.rows[0].id },
            process.env.ACCESS_TOKEN,
            { expiresIn: '5m' }
        );

        res.status(200).json({
            accessToken,
            user: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
});

export default refreshRouter;
