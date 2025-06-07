import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
    ACCESS_TOKEN: process.env.ACCESS_TOKEN!,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN!,
} as const;
