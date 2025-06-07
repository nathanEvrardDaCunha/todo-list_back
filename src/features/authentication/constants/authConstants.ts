import dotenv from 'dotenv';

dotenv.config();

export const BCRYPT_CONFIG = {
    HASH_ROUND: parseInt(process.env.BCRYPT_HASHING_ROUND!),
} as const;

export const MAILER_CONFIG = {
    EMAIL_HOST: process.env.EMAIL_HOST!,
    EMAIL_PORT: process.env.EMAIL_PORT!,
    EMAIL_USER: process.env.EMAIL_USER!,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD!,
    EMAIL_FROM: process.env.EMAIL_FROM!,
} as const;
