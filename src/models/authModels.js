import { pool } from '../builds/database.js';

async function isUsernameTaken(username) {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `SELECT username FROM users WHERE username=$1`,
            [username]
        );
        return result.rows.length > 0;
    } catch (error) {
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
}

async function isEmailTaken(email) {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `SELECT email FROM users WHERE email=$1`,
            [email]
        );
        return result.rows.length > 0;
    } catch (error) {
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
}

async function postUser(username, email, hashedPassword) {
    let client;
    try {
        client = await pool.connect();
        await client.query(
            `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`,
            [username, email, hashedPassword]
        );
    } catch (error) {
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
}

async function getUserByEmail(email) {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            'SELECT id, username, email, password, created_at, updated_at FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
}

async function updateRefreshTokenByUserId(refreshToken, userId) {
    let client;
    try {
        client = await pool.connect();
        await client.query(
            `UPDATE users SET refresh_token = $1 WHERE id = $2`,
            [refreshToken, userId]
        );
    } catch (error) {
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
}

async function updateRefreshTokenToNull(refreshToken) {
    let client;
    try {
        client = await pool.connect();
        await client.query(
            'UPDATE users SET refresh_token = $1 WHERE refresh_token = $2',
            [null, refreshToken]
        );
    } catch (error) {
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
}

export {
    isUsernameTaken,
    isEmailTaken,
    postUser,
    getUserByEmail,
    updateRefreshTokenByUserId,
    updateRefreshTokenToNull,
};
