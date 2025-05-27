import { PoolClient } from 'pg';
import { pool } from '../../builds/database.js';
import { TaskDB, validateTaskDB } from './taskModelsValidation.js';

export async function createTask(
    title: string,
    description: string,
    project: string,
    deadline: Date,
    id: number
): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query(
            `INSERT INTO tasks (title, description, project, deadline, user_id) VALUES ($1, $2, $3, $4, $5)`,
            [title, description, project, deadline, id]
        );
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function fetchUserTaskInDateRange(
    id: number,
    minDeadline: Date,
    maxDeadline: Date
): Promise<TaskDB[]> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        const result = await client.query(
            `SELECT id, title, description, project, deadline, completed from tasks WHERE (user_id=$1) AND (deadline BETWEEN $2 AND $3)`,
            [id, minDeadline, maxDeadline]
        );

        // Will there be an error if "project" or "description" are null ?
        const tasks = result.rows.map((row) => {
            const task: TaskDB = validateTaskDB(
                row.id,
                row.title,
                row.description,
                row.project,
                row.deadline,
                row.completed
            );
            return task;
        });

        return tasks;
    } finally {
        if (client) {
            client.release();
        }
    }
}
