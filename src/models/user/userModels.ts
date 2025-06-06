import { PoolClient } from 'pg';
import { pool } from '../../builds/database.js';
import { UserDB, validateUserDB } from './userModelsValidation.js';

export async function isUsernameUnavailable(
    username: string
): Promise<boolean> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        const result = await client.query(
            `SELECT username FROM users WHERE username=$1`,
            [username]
        );
        return result.rows.length > 0;
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function isEmailUnavailable(email: string): Promise<boolean> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        const result = await client.query(
            `SELECT email FROM users WHERE email=$1`,
            [email]
        );
        return result.rows.length > 0;
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function createUser(
    username: string,
    email: string,
    hashedPassword: string
): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query(
            `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`,
            [username, email, hashedPassword]
        );
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function fetchUserByEmail(email: string): Promise<UserDB | false> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        const result = await client.query(
            'SELECT id, username, email, password, created_at, updated_at FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return false;
        }

        const user = validateUserDB(
            result.rows[0].id,
            result.rows[0].username,
            result.rows[0].email,
            result.rows[0].password,
            result.rows[0].created_at,
            result.rows[0].updated_at
        );

        return user;
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function fetchUserById(id: number): Promise<UserDB | false> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        const result = await client.query(
            'SELECT id, username, email, password, created_at, updated_at FROM users WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return false;
        }

        const user = validateUserDB(
            result.rows[0].id,
            result.rows[0].username,
            result.rows[0].email,
            result.rows[0].password,
            result.rows[0].created_at,
            result.rows[0].updated_at
        );

        return user;
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function setRefreshTokenById(
    refreshToken: string,
    id: number
): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query(
            `UPDATE users SET refresh_token = $1 WHERE id = $2`,
            [refreshToken, id]
        );
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function setRefreshTokenToNull(
    refreshToken: string
): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query(
            'UPDATE users SET refresh_token = $1 WHERE refresh_token = $2',
            [null, refreshToken]
        );
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function setPasswordByUserId(
    hashedPassword: string,
    id: number
): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query(`UPDATE users SET password = $1 WHERE id = $2`, [
            hashedPassword,
            id,
        ]);
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function updateUserByUserId(
    username: string,
    email: string,
    id: number
): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query(
            `UPDATE users SET username = $1, email = $2  WHERE id = $3`,
            [username, email, id]
        );
    } finally {
        if (client) {
            client.release();
        }
    }
}
