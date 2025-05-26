import dotenv from 'dotenv';

dotenv.config();

export const BCRYPT_CONFIG = {
    HASH_ROUND: parseInt(process.env.BCRYPT_HASHING_ROUND || '10'),
} as const;
