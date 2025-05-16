import dotenv from 'dotenv';

// Should there be only one dotenv in the project ?
// If I remember correctly, doing that crash my program => Need to dig deeper
dotenv.config();

const DB_CONFIGURATION = Object.freeze({
    NAME: process.env.DATABASE_NAME || 'todolist',
    HOST: process.env.DATABASE_HOST || 'db',
    PORT: process.env.DATABASE_PORT || '5432',
    USER: process.env.DATABASE_USER || 'postgres',
    PASSWORD: process.env.DATABASE_PASSWORD || 'postgres',
});

const DB_USER = Object.freeze({
    MIN_USERNAME_LENGTH: 5,
    MAX_USERNAME_LENGTH: 50,
    MIN_EMAIL_LENGTH: 5,
    MAX_EMAIL_LENGTH: 150,
    MIN_PASSWORD_LENGTH: 5,
    MAX_PASSWORD_LENGTH: 200,
    MAX_REFRESH_TOKEN_LENGTH: 400,
});

const DB_TASK = Object.freeze({
    MIN_TITLE_LENGTH: 1,
    MAX_TITLE_LENGTH: 150,
    MIN_DESCRIPTION_LENGTH: 0,
    MAX_DESCRIPTION_LENGTH: 400,
});

export { DB_CONFIGURATION, DB_USER, DB_TASK };
