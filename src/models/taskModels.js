import { pool } from '../builds/database.js';

export async function postTask(title, description, project, deadline, userId) {
    let client;
    try {
        client = await pool.connect();
        await client.query(
            `INSERT INTO tasks (title, description, project, deadline, user_id) VALUES ($1, $2, $3, $4, $5)`,
            [title, description, project, deadline, userId]
        );
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function getTasksFromUserId(userId, minDeadline, maxDeadline) {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `SELECT id, title, description, project, deadline, completed from tasks WHERE (user_id=$1) AND (deadline BETWEEN $2 AND $3)`,
            [userId, minDeadline, maxDeadline]
        );

        const tasks = result.rows.map((row) => {
            return {
                id: row.id,
                title: row.title,
                description: row.description,
                project: row.project,
                deadline: row.deadline,
                completed: row.completed,
            };
        });

        return tasks;
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
}

/**
 * @typedef User
 * @property {number} id
 * @property {string} username
 * @property {string} email
 * @property {string} password
 * @property {TimeStamp} created_at
 * @property {TimeStamp} updated_at
 * @property {string} refresh_token
 *
 * @export
 * @async
 * @param {number} id
 * @return {Promise<User>}
 */
export async function getUserById(id) {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            'SELECT id, username, email, password, created_at, updated_at, refresh_token FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
}
