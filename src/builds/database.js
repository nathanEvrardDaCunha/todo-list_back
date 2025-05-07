import pkg, { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// TO-NOTE: Different order or argument from my experiments from before.
const pool = Pool({
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
});

pool.on('connect', () => {
    console.log(
        `Connection pool established with database ${process.env.DATABASE_NAME} on port ${process.env.DATABASE_HOST}`
    );
});

// TO-CONSIDER: Find a way to relaunch automatically the pool when it close ?
pool.on('error', () => {
    console.log(`Unexpected error occurred on idle database client`, err);
    process.exit(-1);
});

// TO-TEST: If I remember correctly, there can only be one pool once, containing all the clients ?
async function establishDatabaseConnection() {
    try {
        const client = await pool.connect();
        console.log(`Connection established to database.`);
        client.release();
        return true;
    } catch (error) {
        console.log(`Cannot established connection to database !`, error);
        return false;
    }
}

// TO-CONSIDER: Each function should open and, especially, close it's client ?
// TO-CONSIDER: Is it possible to link the VARCHAR value to a variable to enforce consistency between it and my routes logic ?
// TO-DO: Sync tasks route logic to the tasks's table VARCHARs
async function initializeDatabase() {
    try {
        const client = await pool.connect();

        await client.query(`CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(150) NOT NULL UNIQUE,
                password VARCHAR(200) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // TO-CONSIDER: My experiment don't implement the FOREIGN KEY like that.
        await client.query(`CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title VARCHAR(150) NOT NULL,
                description VARCHAR(300) NULL,
                completed BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        client.release();
        console.log(`Database initialization has been completed.`);
    } catch (error) {
        // TO-CONSIDER: My experiment doesn't throw the error but console.error it.
        throw new Error(`Cannot initialize the database !`, error);
    }
}

// TO-CONSIDER: In my experiment, the first export also included 'pool'.
export { establishDatabaseConnection, initializeDatabase };
export default pool;
