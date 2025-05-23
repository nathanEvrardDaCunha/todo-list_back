import express from 'express';
import errorHandler from './middlewares/errorHandler.js';
import {
    establishDatabaseConnection,
    initializeDatabase,
} from './builds/database.js';
import { pool } from './builds/database.js';
import tokenHandler from './middlewares/tokenHandler.js';
import tokenRouter from './routes/tokenRoutes.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js';
import { DB_CONFIGURATION } from './constants/database-constants.js';
import { APP_CONFIGURATION } from './constants/application-constants.js';
import cors from 'cors';
import taskRouter from './routes/taskRoutes.js';

const app = express();

// Updated CORS configuration to allow credentials
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,POST,UPDATE,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Important: Allow credentials (cookies)
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.get('/api', (req, res) => {
    res.status(200).json({ message: 'Default API route work fine.' });
});

app.use('/api/auth', authRouter);
app.use('/api/token', tokenRouter);

app.use(tokenHandler);
app.use('/api/task', taskRouter);

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
