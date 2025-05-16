import dotenv from 'dotenv';

dotenv.config();

const APP_CONFIGURATION = Object.freeze({
    PORT: process.env.APP_PORT || '5003',
    URL: process.env.APP_URL || 'http://localhost:',
    NODE_ENV: process.env.NODE_ENV || 'development',
});

export { APP_CONFIGURATION };
