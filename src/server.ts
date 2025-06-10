import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectToDB, initializeDB } from './builds/database.js';
import { APP_CONFIG } from './serverConstants.js';
import { DB_CONFIG } from './builds/databaseConstants.js';
import errorHandler from './middlewares/errorHandlers.js';
import authRouter from './features/authentication/routes/authRoutes.js';
import tokenRouter from './features/tokens/routes/tokenRoutes.js';
import taskRouter from './features/tasks/routes/taskRoutes.js';
import { tokenHandler } from './middlewares/tokenHandler.js';
import userRouter from './features/users/routes/userRoutes.js';
import contactRouter from './features/contact/routes/contactRoutes.js';

dotenv.config();

const app: Application = express();

interface CorsOption {
    origin: string;
    methods: string;
    allowedHeaders: string[];
    credentials: boolean;
}

// Make the site HTTPS with 'secure' and 'strict' the day I deploy to production ?

const corsOptions: CorsOption = {
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// IF refresh token is expired (and not access token) => indicate to user to /login

app.use('/api/auth', authRouter);
app.use(contactRouter);
app.use('/api/token', tokenRouter);

app.use(tokenHandler);
app.use('/api/task', taskRouter);
app.use('/api/user', userRouter);

app.use(errorHandler);

async function startServer(): Promise<void> {
    try {
        await connectToDB();

        await initializeDB();

        app.listen(APP_CONFIG.PORT, () => {
            console.log(`Server run on ${APP_CONFIG.ENV} mode`);
            console.log(`API run on: ${APP_CONFIG.URL}${APP_CONFIG.PORT}`);
            console.log(`Pool connect to: ${DB_CONFIG.NAME}:${DB_CONFIG.PORT}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

startServer();
