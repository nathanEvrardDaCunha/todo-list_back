import pkg from 'pg';
import {
    DB_CONFIGURATION,
    DB_USER,
    DB_TASK,
} from '../constants/database-constants.js';

const { Pool } = pkg;

const pool = new Pool({
    database: DB_CONFIGURATION.NAME,
    host: DB_CONFIGURATION.HOST,
    port: DB_CONFIGURATION.PORT,
    user: DB_CONFIGURATION.USER,
    password: DB_CONFIGURATION.PASSWORD,
});

pool.on('connect', () => {
    console.log(
        `Connection pool established with database ${DB_CONFIGURATION.NAME} on port ${DB_CONFIGURATION.PORT}`
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
                project VARCHAR(${DB_TASK.MAX_PROJECT_LENGTH}) NULL,
                deadline DATE NOT NULL,
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
