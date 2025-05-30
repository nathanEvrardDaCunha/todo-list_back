import {
    completeTask,
    createTask,
    deleteTask,
    fetchUserTaskInDateRange,
} from '../../../models/task/taskModels.js';
import { TaskDB } from '../../../models/task/taskModelsValidation.js';
import { fetchUserById } from '../../../models/user/userModels.js';
import {
    NotFoundError,
    UnauthorizedError,
} from '../../../utils/errors/ClientError.js';
import { isUndefined } from '../../../utils/validation/genericValidation.js';
import {
    validateDeadline,
    validateDescription,
    validateProject,
    validateTaskId,
    validateTitle,
} from '../validations/taskValidation.js';

export async function createTaskService(
    title: any,
    description: any,
    project: any,
    deadline: any,
    userId: number | undefined
): Promise<void> {
    const newTitle = validateTitle(title);
    const newDescription = validateDescription(description);
    const newProject = validateProject(project);
    const newDeadline = validateDeadline(deadline);

    const newUserId = userId;
    if (isUndefined(newUserId)) {
        throw new UnauthorizedError('The user id is not valid !');
    }

    const user = await fetchUserById(newUserId);
    if (!user) {
        throw new NotFoundError('User has not been found in database !');
    }

    const convertedDeadline = new Date(newDeadline);
    await createTask(
        newTitle,
        newDescription,
        newProject,
        convertedDeadline,
        user.id
    );
}

export async function fetchTodayTasksService(
    userId: number | undefined
): Promise<TaskDB[]> {
    const newUserId = userId;
    if (isUndefined(newUserId)) {
        throw new UnauthorizedError('The user id is not valid !');
    }

    const user = await fetchUserById(newUserId);
    if (!user) {
        throw new NotFoundError('User has not been found in database !');
    }

    const minDeadline = new Date('1990-01-01');
    const maxDeadline = new Date();
    maxDeadline.setHours(23, 59, 59, 999);

    const tasks = await fetchUserTaskInDateRange(
        user.id,
        minDeadline,
        maxDeadline
    );

    return tasks;
}

// Check if task exist ?
export async function completeTaskService(taskId: string) {
    const newTaskId = validateTaskId(taskId);

    await completeTask(newTaskId);
}

// Check if task exist ?
export async function deleteTaskService(taskId: string) {
    const newTaskId = validateTaskId(taskId);

    await deleteTask(newTaskId);
}
