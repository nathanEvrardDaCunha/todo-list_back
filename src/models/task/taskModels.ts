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

export async function completeTask(taskId: number): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query('UPDATE tasks SET completed=true WHERE (id=$1)', [
            taskId,
        ]);
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function deleteTask(taskId: number): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query('DELETE FROM tasks WHERE (id=$1)', [taskId]);
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function fetchTaskById(taskId: number): Promise<TaskDB> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        const result = await client.query(
            `SELECT id, title, description, project, deadline, completed from tasks WHERE (id=$1)`,
            [taskId]
        );

        const task = validateTaskDB(
            result.rows[0].id,
            result.rows[0].title,
            result.rows[0].description,
            result.rows[0].project,
            result.rows[0].deadline,
            result.rows[0].completed
        );

        return task;
    } finally {
        if (client) {
            client.release();
        }
    }
}
