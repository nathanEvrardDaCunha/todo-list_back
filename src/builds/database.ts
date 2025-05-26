import pkg from 'pg';
import { DB_CONFIG, DB_TASK, DB_USER } from './databaseConstants.js';

// =============== SETUP =============== //

const { Pool } = pkg;

export const pool: pkg.Pool = new Pool({
    database: DB_CONFIG.NAME,
    host: DB_CONFIG.HOST,
    port: DB_CONFIG.PORT,
    user: DB_CONFIG.USER,
    password: DB_CONFIG.PASSWORD,
});

pool.on('connect', () => {
    console.log(`Connection pool established with database ${DB_CONFIG.NAME} on port ${DB_CONFIG.PORT}`);
});

pool.on('error', (err) => {
    console.error(`Unexpected error occurred on idle database client:`, err);
    process.exit(1);
});

// =============== LOGIC =============== //

export async function connectToDB(): Promise<void> {
    let client: pkg.PoolClient | undefined;
    try {
        client = await pool.connect();
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function initializeDB(): Promise<void> {
    let client: pkg.PoolClient | undefined;
    try {
        client = await pool.connect();

        await client.query(`CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(${DB_USER.MAX_USERNAME_LENGTH}) NOT NULL UNIQUE,
                email VARCHAR(${DB_USER.MAX_EMAIL_LENGTH}) NOT NULL UNIQUE,
                password VARCHAR(${DB_USER.MAX_PASSWORD_LENGTH}) NOT NULL,
                refresh_token VARCHAR(${DB_USER.MAX_REFRESH_TOKEN_LENGTH}) UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(${DB_TASK.MAX_TITLE_LENGTH}) NOT NULL,
                description VARCHAR(${DB_TASK.MAX_DESCRIPTION_LENGTH}) NULL,
                project VARCHAR(${DB_TASK.MAX_PROJECT_LENGTH}) NULL,
                deadline DATE NOT NULL,
                completed BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
    } finally {
        if (client) {
            client.release();
        }
    }
}
