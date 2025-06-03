import {
    completeTask,
    createTask,
    deleteTask,
    fetchTaskById,
    fetchTaskByUserId,
    updateTaskById,
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

    const tasks = await fetchTaskByUserId(user.id);

    return tasks;
}

export async function completeTaskService(taskId: string) {
    // Maybe verify the task does belong to the right user before updating it ?

    const newTaskId = validateTaskId(taskId);

    const task = await fetchTaskById(newTaskId);
    if (!task) {
        throw new NotFoundError('Task has not been found in database !');
    }

    await completeTask(newTaskId);
}

export async function deleteTaskService(taskId: string) {
    // Maybe verify the task does belong to the right user before updating it ?

    const newTaskId = validateTaskId(taskId);

    const task = await fetchTaskById(newTaskId);
    if (!task) {
        throw new NotFoundError('Task has not been found in database !');
    }

    await deleteTask(newTaskId);
}

export async function updateTaskService(
    title: any,
    description: any,
    project: any,
    deadline: any,
    userId: number | undefined,
    taskId: string
): Promise<void> {
    const newTitle = validateTitle(title);
    const newDescription = validateDescription(description);
    const newProject = validateProject(project);
    const newDeadline = validateDeadline(deadline);

    const newTaskId = validateTaskId(taskId);

    const task = await fetchTaskById(newTaskId);
    if (!task) {
        throw new NotFoundError('Task has not been found in database !');
    }

    // Maybe verify the task does belong to the right user before updating it ?

    // const newUserId = userId;
    // if (isUndefined(newUserId)) {
    //     throw new UnauthorizedError('The user id is not valid !');
    // }

    // const user = await fetchUserById(newUserId);
    // if (!user) {
    //     throw new NotFoundError('User has not been found in database !');
    // }

    const convertedDeadline = new Date(newDeadline);
    await updateTaskById(
        newTitle,
        newDescription,
        newProject,
        convertedDeadline,
        newTaskId
    );
}
