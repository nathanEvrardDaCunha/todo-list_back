import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import {
    establishDatabaseConnection,
    initializeDatabase,
} from './builds/database.js';
import { pool } from './builds/database.js';
import tokenHandler from './middlewares/tokenHandler.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api', (req, res) => {
    res.status(200).json({ message: 'Default API route work fine.' });
});

app.use('/api/auth', authRouter);

app.use(tokenHandler);

app.get('/api/users', async (req, res) => {
    try {
        const client = await pool.connect();

        const result = await client.query(
            `SELECT id, username, email, created_at, updated_at from users`
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
