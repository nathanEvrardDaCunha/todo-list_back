import dotenv from 'dotenv';

dotenv.config();

const BCRYPT_CONFIGURATION = Object.freeze({
    HASHING_ROUND: process.env.BCRYPT_HASHING_ROUND || '10',
});

export { BCRYPT_CONFIGURATION };
