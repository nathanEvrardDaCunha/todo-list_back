import dotenv from 'dotenv';

dotenv.config();

export const DB_CONFIG = {
    NAME: process.env.DATABASE_NAME || 'todolist',
    HOST: process.env.DATABASE_HOST || 'db',
    PORT: parseInt(process.env.DATABASE_PORT || '5432'),
    USER: process.env.DATABASE_USER || 'postgres',
    PASSWORD: process.env.DATABASE_PASSWORD || 'postgres',
} as const;

export const DB_USER = {
    MIN_USERNAME_LENGTH: 5,
    MAX_USERNAME_LENGTH: 50,
    MIN_EMAIL_LENGTH: 5,
    MAX_EMAIL_LENGTH: 150,
    MIN_PASSWORD_LENGTH: 5,
    MAX_PASSWORD_LENGTH: 200,
    MIN_REFRESH_TOKEN_LENGTH: 1,
    MAX_REFRESH_TOKEN_LENGTH: 400,
} as const;

export const DB_TASK = {
    MIN_TITLE_LENGTH: 1,
    MAX_TITLE_LENGTH: 150,
    MIN_DESCRIPTION_LENGTH: 0,
    MAX_DESCRIPTION_LENGTH: 400,
    MIN_PROJECT_LENGTH: 0,
    MAX_PROJECT_LENGTH: 100,
    MIN_DEADLINE_LENGTH: 0,
    MAX_DEADLINE_LENGTH: 400,
} as const;
