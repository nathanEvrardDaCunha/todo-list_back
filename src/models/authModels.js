import { pool } from '../builds/database.js';

// TO-CONSIDER: Replace the "SELECT *" by specific column selection "SELECT id, username..."
// TO-CONSIDER: Add a "finally" to every try catch using 'pool' in my entire codebase
// TO-CONSIDER: Add try/catch/finally for everything that can break or throw an error, and, in each files insert the next(error)

// For example, if my query is wrong or wrongly formatted, will it throw or return an error, or anything else ?
async function isUsernameTaken(username) {
    const client = await pool.connect();

    const result = await client.query(`SELECT * FROM users WHERE username=$1`, [
        username,
    ]);

    client.release();

    const zeroUsernameFound = 0;
    if (result.rows.length > zeroUsernameFound) {
        return true;
    }

    return false;
}

// For example, if my query is wrong or wrongly formatted, will it throw or return an error, or anything else ?
async function isEmailTaken(email) {
    const client = await pool.connect();

    const result = await client.query(`SELECT * FROM users WHERE email=$1`, [
        email,
    ]);

    client.release();

    const zeroEmailFound = 0;
    if (result.rows.length > zeroEmailFound) {
        return true;
    }

    return false;
}

// For example, if my query is wrong or wrongly formatted, will it throw or return an error, or anything else ?
async function postUser(username, email, hashedPassword) {
    const client = await pool.connect();

    await client.query(
        `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`,
        [username, email, hashedPassword]
    );

    client.release();
}

// If its promise<any>, does this mean it can return an error ? If so, it'll only return it and not throw it ?
// For example, if my query is wrong or wrongly formatted, will it throw or return an error, or anything else ?
async function getUserByEmail(email) {
    const client = await pool.connect();
    // TO-CONSIDER: Try using this part of query instead: 'id, username, email, created_at, updated_at' ?
    const result = await client.query('SELECT * FROM users WHERE email = $1', [
        email,
    ]);
    client.release();
    return result.rows[0];
}

// For example, if my query is wrong or wrongly formatted, will it throw or return an error, or anything else ?
async function updateRefreshTokenByUserId(refreshToken, userId) {
    const client = await pool.connect();
    await client.query(`UPDATE users SET refresh_token = $1 WHERE id = $2`, [
        refreshToken,
        userId,
    ]);
    client.release();
}

// For example, if my query is wrong or wrongly formatted, will it throw or return an error, or anything else ?
async function updateRefreshTokenToNull(refreshToken) {
    const client = await pool.connect();
    await client.query(
        'UPDATE users SET refresh_token = $1 WHERE refresh_token = $2',
        [null, refreshToken]
    );
    client.release();
}

export {
    isUsernameTaken,
    isEmailTaken,
    postUser,
    getUserByEmail,
    updateRefreshTokenByUserId,
    updateRefreshTokenToNull,
};
