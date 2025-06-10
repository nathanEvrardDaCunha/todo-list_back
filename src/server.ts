// src/server.ts - UPDATED CORS SECTION
import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectToDB, initializeDB } from './builds/database.js';
import { APP_CONFIG } from './serverConstants.js';
import errorHandler from './middlewares/errorHandlers.js';
import authRouter from './features/authentication/routes/authRoutes.js';
import tokenRouter from './features/tokens/routes/tokenRoutes.js';
import taskRouter from './features/tasks/routes/taskRoutes.js';
import { tokenHandler } from './middlewares/tokenHandler.js';
import userRouter from './features/users/routes/userRoutes.js';
import contactRouter from './features/contact/routes/contactRoutes.js';

dotenv.config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});

const app: Application = express();

interface CorsOption {
    origin: string | string[];
    methods: string;
    allowedHeaders: string[];
    credentials: boolean;
}

const corsOptions: CorsOption = {
    origin:
        process.env.NODE_ENV === 'production'
            ? [process.env.APP_URL || 'https://localhost:3000'] // Use environment variable
            : 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Add a health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});

// Security headers
app.use((req, res, next) => {
    // Force HTTPS in production
    if (process.env.NODE_ENV === 'production') {
        res.setHeader(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains'
        );
    }
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    // XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    // Disable MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Restrict referrer information
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

app.use('/api/auth', authRouter);
app.use(contactRouter);
app.use('/api/token', tokenRouter);

app.use(tokenHandler);
app.use('/api/task', taskRouter);
app.use('/api/user', userRouter);

app.use(errorHandler);

async function startServer(): Promise<void> {
    try {
        console.log('Starting server...');
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Port:', APP_CONFIG.PORT);

        await connectToDB();
        await initializeDB();

        const port = process.env.PORT || APP_CONFIG.PORT;
        app.listen(port, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode`);
            console.log(`API running on port: ${port}`);
            console.log('Database connection successful');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
