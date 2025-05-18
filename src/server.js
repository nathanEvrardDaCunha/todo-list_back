import express from 'express';
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
import { DB_CONFIGURATION } from './constants/database-constants.js';
import { APP_CONFIGURATION } from './constants/application-constants.js';
import cors from 'cors';
import taskRouter from './routes/taskRoutes.js';

// TO-CONSIDER: Add typescript without hot reload, and on docker, to prevent editor errors

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,POST,UPDATE,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(cookieParser());

// TO-DO: Handle non implemented route.

app.get('/api', (req, res) => {
    res.status(200).json({ message: 'Default API route work fine.' });
});

app.use('/api/auth', authRouter);

// TO-CONSIDER: Also divide as router, controller... the refreshToken logic ?
// => Or include it inside the authentication logic ?
app.use('/api/token', refreshRouter);

// TO-DO: Move back the "/api/task" below the tokenHandler middleware after the whole logic is implemented.
app.use('/api/task', taskRouter);

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
        await establishDatabaseConnection();

        await initializeDatabase();

        app.listen(APP_CONFIGURATION.PORT, () => {
            console.log(
                `Server running in ${APP_CONFIGURATION.NODE_ENV} mode.`
            );
            console.log(
                `API is running on: ${APP_CONFIGURATION.URL}${APP_CONFIGURATION.PORT}.`
            );
            console.log(
                `Pool established with database ${DB_CONFIGURATION.NAME} on port ${DB_CONFIGURATION.PORT}`
            );
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

startServer();
