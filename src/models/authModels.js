import { pool } from '../builds/database.js';

// TO-CONSIDER: Replace the "SELECT *" by specific column selection "SELECT id, username..."
// TO-CONSIDER: Add a "finally" to every try catch using 'pool' in my entire codebase
// TO-CONSIDER: Add try/catch/finally for everything that can break or throw an error, and, in each files insert the next(error)

// For example, if my query is wrong or wrongly formatted, will it throw or return an error, or anything else ?
async function isUsernameTaken(username) {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `SELECT * FROM users WHERE username=$1`,
            [username]
        );
        return result.rows.length > 0;
    } catch (error) {
        throw new Error(error);
    } finally {
        if (client) {
            client.release();
        }
    }
}

// For example, if my query is wrong or wrongly formatted, will it throw or return an error, or anything else ?
async function isEmailTaken(email) {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `SELECT * FROM users WHERE email=$1`,
            [email]
        );
        return result.rows.length > 0;
    } catch (error) {
        throw new Error(error);
    } finally {
        if (client) {
            client.release();
        }
    }
}

// For example, if my query is wrong or wrongly formatted, will it throw or return an error, or anything else ?
async function postUser(username, email, hashedPassword) {
    let client;
    try {
        client = await pool.connect();
        await client.query(
            `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`,
            [username, email, hashedPassword]
        );
    } catch (error) {
        throw new Error(error);
    } finally {
        if (client) {
            client.release();
        }
    }
}

// If its promise<any>, does this mean it can return an error ? If so, it'll only return it and not throw it ?
// For example, if my query is wrong or wrongly formatted, will it throw or return an error, or anything else ?
async function getUserByEmail(email) {
    let client;
    try {
        client = await pool.connect();
        // TO-CONSIDER: Try using this part of query instead: 'id, username, email, created_at, updated_at' ?
        const result = await client.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        // What if it doesn't find any user ?
        return result.rows[0];
    } catch (error) {
        throw new Error(error);
    } finally {
        if (client) {
            client.release();
        }
    }
}

// For example, if my query is wrong or wrongly formatted, will it throw or return an error, or anything else ?
async function updateRefreshTokenByUserId(refreshToken, userId) {
    let client;
    try {
        client = await pool.connect();
        await client.query(
            `UPDATE users SET refresh_token = $1 WHERE id = $2`,
            [refreshToken, userId]
        );
    } catch (error) {
        throw new Error(error);
    } finally {
        if (client) {
            client.release();
        }
    }
}

// For example, if my query is wrong or wrongly formatted, will it throw or return an error, or anything else ?
async function updateRefreshTokenToNull(refreshToken) {
    let client;
    try {
        client = await pool.connect();
        await client.query(
            'UPDATE users SET refresh_token = $1 WHERE refresh_token = $2',
            [null, refreshToken]
        );
    } catch (error) {
        throw new Error(error);
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
