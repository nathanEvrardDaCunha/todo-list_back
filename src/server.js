import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandler.js';
import {
    establishDatabaseConnection,
    initializeDatabase,
} from './builds/database.js';
import { pool } from './builds/database.js';
import tokenHandler from './middlewares/tokenHandler.js';
import refreshRouter from './routes/refreshRoutes.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js';

// TO-DO: Validate my environment properties are defined, else, create fallback values.
// TO-CONSIDER: Add typescript without hot reload, and on docker, to prevent editor errors
// TO-CONSIDER: Add relevant HTTP Status Code: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/api', (req, res) => {
    res.status(200).json({ message: 'Default API route work fine.' });
});

app.use('/api/auth', authRouter);

// TO-CONSIDER: Also divide as router, controller... the refreshToken logic ?
// => Or include it inside the authentication logic ?
app.use('/token', refreshRouter);

app.use(tokenHandler);

// TO-FIX: User can still use it after log out because access token is still valid for few minutes
app.get('/api/users', async (req, res) => {
    try {
        const client = await pool.connect();

        const result = await client.query(
            `SELECT id, username, email, password, created_at, updated_at, refresh_token from users`
        );

        client.release();

        res.status(200).json({
            result: result.rows,
        });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: error.message,
        });
    }
});

app.use(errorHandler);

async function startServer() {
    try {
        const isConnectionEstablished = await establishDatabaseConnection();

        if (!isConnectionEstablished) {
            throw new Error(
                `Cannot establish connection to the database during server launch !`
            );
        }

        await initializeDatabase();

        app.listen(process.env.APP_PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode.`);
            console.log(
                `API is running on: ${process.env.APP_URL}${process.env.APP_PORT}.`
            );
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

startServer();
