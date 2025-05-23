import { HTTP_SUCCESS_CODE } from '../constants/http-constants.js';
import {
    fetchTodayTasksByUserId,
    insertTask,
} from '../services/taskServices.js';

async function getTodayTasks(req, res, next) {
    try {
        // Get userId from JWT token (set by tokenHandler middleware)
        const userId = req.id;

        if (!userId) {
            return res.status(401).json({
                message: 'User ID not found in token',
            });
        }

        const tasks = await fetchTodayTasksByUserId(userId);

        res.status(HTTP_SUCCESS_CODE.OK).json({
            status: 'success',
            message: 'Today tasks retrieved successfully',
            tasks: tasks,
        });
    } catch (error) {
        next(error);
    }
}

async function createTask(req, res, next) {
    try {
        // Get userId from JWT token (set by tokenHandler middleware)
        const userId = req.id;

        if (!userId) {
            return res.status(401).json({
                message: 'User ID not found in token',
            });
        }

        // Extract task data from request body (no userId from client)
        const { title, description, project, deadline } = req.body;

        // Validate required fields
        if (!title || !description || !project || !deadline) {
            return res.status(400).json({
                message:
                    'All fields (title, description, project, deadline) are required',
            });
        }

        // Validate fields aren't just whitespace
        if (!title.trim() || !description.trim() || !project.trim()) {
            return res.status(400).json({
                message: 'Fields cannot be empty or just whitespace',
            });
        }

        // Create task with userId from token
        const taskData = {
            userId: userId, // Use userId from JWT token, not from client
            title: title.trim(),
            description: description.trim(),
            project: project.trim(),
            deadline,
        };

        const newTask = await insertTask(taskData);

        res.status(HTTP_SUCCESS_CODE.CREATED || 201).json({
            status: 'success',
            message: 'Task created successfully',
            task: newTask,
        });
    } catch (error) {
        next(error);
    }
}

export { getTodayTasks, createTask };
