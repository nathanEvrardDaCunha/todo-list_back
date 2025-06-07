import dotenv from 'dotenv';

dotenv.config();

export const APP_CONFIG = {
    PORT: parseInt(process.env.APP_PORT!),
    URL: process.env.APP_URL!,
    ENV: process.env.NODE_ENV!,
} as const;
