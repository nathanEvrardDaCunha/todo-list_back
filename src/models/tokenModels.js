import { pool } from '../builds/database.js';

async function getUserById(id) {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            'SELECT id, username, email, created_at, updated_at FROM users WHERE id = $1',
            [id]
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

export { getUserById };
