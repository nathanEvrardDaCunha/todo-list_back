import pkg from 'pg';
import dotenv from 'dotenv';
import { DB_USER, DB_TASK } from '../constants/database-constants.js';

dotenv.config();

const { Pool } = pkg;

// TO-DO: Validate my environment properties are defined, else, create fallback values.

const pool = new Pool({
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
});

pool.on('connect', () => {
    console.log(
        `Connection pool established with database ${process.env.DATABASE_NAME} on port ${process.env.DATABASE_PORT}`
    );
});

// TO-CONSIDER: Find a way to relaunch automatically the pool when it close ?
pool.on('error', (err) => {
    console.error(`Unexpected error occurred on idle database client:`, err);
    process.exit(1);
});

async function establishDatabaseConnection() {
    let client;
    try {
        client = await pool.connect();
    } catch (error) {
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
}

// TO-DO: Sync tasks route logic to the tasks's table VARCHARs
async function initializeDatabase() {
    let client;
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
                completed BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
    } catch (error) {
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
}

export { pool, establishDatabaseConnection, initializeDatabase };
