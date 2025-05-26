import dotenv from 'dotenv';

dotenv.config();

export const APP_CONFIG = {
    PORT: parseInt(process.env.APP_PORT || '5003'),
    URL: process.env.APP_URL || 'http://localhost:',
    ENV: process.env.NODE_ENV || 'development',
} as const;
