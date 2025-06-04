import dotenv from 'dotenv';

dotenv.config();

export const BCRYPT_CONFIG = {
    HASH_ROUND: parseInt(process.env.BCRYPT_HASHING_ROUND || '10'),
} as const;

export const MAILER_CONFIG = {
    EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
    EMAIL_PORT: process.env.EMAIL_PORT || '587',
    EMAIL_USER: process.env.EMAIL_USER || 'quick.task.corp@gmail.com',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || 'sodysoqiryaybkmy',
    EMAIL_FROM: process.env.EMAIL_FROM || 'quick.task.corp@gmail.com',
} as const;
