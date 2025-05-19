import { ClientError } from '../utils/BaseError.js';
import { HTTP_CLIENT_CODE } from '../constants/http-constants.js';
import { DB_TASK } from '../constants/database-constants.js';
import {
    getTasksFromUserId,
    postTask,
    getUserById,
} from '../models/taskModels.js';

const isUndefined = (value) => value === undefined;
const isNotString = (value) => typeof value !== 'string';
const isShorterEqualThan = (value, shorterLength) => value < shorterLength;
const isLongerEqualThan = (value, higherLength) => value > higherLength;
const isTitleInvalid = (value) => !/^[A-Za-z0-9 !@#$%&*_-]+$/.test(value);
const isDescriptionInvalid = (value) =>
    !/^[A-Za-z0-9 !@#$%&*_\n\\-]+$/.test(value);
const isProjectInvalid = (value) => !/^[A-Za-z\s]*$/.test(value);
const isDateInvalid = (value) => isNaN(new Date(value)); //Should return a JS error by default if deadline can't become a Date ?
const isNumberInvalid = (value) => isNaN(new Number(value));

function validateStringProperty(value, valueName, minLength, maxLength) {
    try {
        if (isUndefined(value)) {
            throw new ClientError(
                `Invalid property`,
                `Cannot process undefined ${valueName} property !`,
                HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
            );
        }

        if (isNotString(value)) {
            throw new ClientError(
                `Invalid property`,
                `Cannot process non-string ${valueName} property !`,
                HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
            );
        }

        if (isShorterEqualThan(value.length, minLength)) {
            throw new ClientError(
                `Invalid property`,
                `Cannot process ${valueName} property shorter than ${minLength} characters !`,
                HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
            );
        }

        if (isLongerEqualThan(value.length, maxLength)) {
            throw new ClientError(
                `Invalid property`,
                `Cannot process ${valueName} property longer than ${maxLength} characters !`,
                HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
            );
        }
    } catch (error) {
        throw error;
    }
}

// Title doesn't throw error when it's value is "   " just empty space
function validateTitle(title) {
    try {
        validateStringProperty(
            title,
            'title',
            DB_TASK.MIN_TITLE_LENGTH,
            DB_TASK.MAX_TITLE_LENGTH
        );

        if (isTitleInvalid(title)) {
            throw new ClientError(
                `Invalid property`,
                `Cannot process invalid ${'title'} property !`,
                HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
            );
        }
    } catch (error) {
        throw error;
    }
}

// Description doesn't throw error when it's value is "   " just empty space
// even if it can be null, empty space might not be the best idea
function validateDescription(description) {
    try {
        validateStringProperty(
            description,
            'description',
            DB_TASK.MIN_DESCRIPTION_LENGTH,
            DB_TASK.MAX_DESCRIPTION_LENGTH
        );

        if (isDescriptionInvalid(description)) {
            throw new ClientError(
                `Invalid property`,
                `Cannot process invalid ${'description'} property !`,
                HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
            );
        }
    } catch (error) {
        throw error;
    }
}

// Project doesn't throw error when it's value is "   " just empty space
// even if it can be null, empty space might not be the best idea
function validateProject(project) {
    try {
        validateStringProperty(
            project,
            'project',
            DB_TASK.MIN_PROJECT_LENGTH,
            DB_TASK.MAX_PROJECT_LENGTH
        );

        if (isProjectInvalid(project)) {
            throw new ClientError(
                `Invalid property`,
                `Cannot process invalid ${'project'} property !`,
                HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
            );
        }
    } catch (error) {
        throw error;
    }
}

function validateDeadline(deadline) {
    try {
        if (isUndefined(deadline)) {
            throw new ClientError(
                `Invalid property`,
                `Cannot process undefined ${'deadline'} property !`,
                HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
            );
        }

        if (isNotString(deadline)) {
            throw new ClientError(
                `Invalid property`,
                `Cannot process non-string ${'deadline'} property !`,
                HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
            );
        }

        if (isDateInvalid(deadline)) {
            throw new ClientError(
                `Invalid property`,
                `Cannot process invalid ${'deadline'} as Date !`,
                HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
            );
        }
    } catch (error) {
        throw error;
    }
}

function validateUserId(userId) {
    try {
        if (isUndefined(userId)) {
            throw new ClientError(
                `Invalid property`,
                `Cannot process undefined ${'userId'} property !`,
                HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
            );
        }

        if (isNotString(userId)) {
            throw new ClientError(
                `Invalid property`,
                `Cannot process non-string ${'userId'} property !`,
                HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
            );
        }

        if (isNumberInvalid(userId)) {
            throw new ClientError(
                `Invalid property`,
                `Cannot process invalid ${'userId'} as number !`,
                HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
            );
        }
    } catch (error) {
        throw error;
    }
}

async function createTask(title, description, project, deadline, userId) {
    try {
        validateTitle(title);
        validateDescription(description);
        validateProject(project);
        validateDeadline(deadline);
        validateUserId(userId);

        const user = await getUserById(userId);
        if (!user) {
            throw new ClientError(
                `Invalid Credentials`,
                `Cannot process today task fetching because no user has been found !`,
                HTTP_CLIENT_CODE.UNAUTHORIZED
            );
        }

        const newDeadline = new Date(deadline);
        const newUserId = new Number(userId);

        await postTask(title, description, project, newDeadline, newUserId);

        return {
            title: title,
            description: description,
            project: project,
            deadline: deadline,
            userId: userId,
        };
    } catch (error) {
        throw error;
    }
}

async function returnTodayTask(userId) {
    try {
        validateUserId(userId);

        const numericUserId = Number(userId);

        const user = await getUserById(numericUserId);
        if (!user) {
            throw new ClientError(
                `Invalid Credentials`,
                `Cannot process today task fetching because no user has been found !`,
                HTTP_CLIENT_CODE.UNAUTHORIZED
            );
        }

        const minDeadline = new Date('1990-01-01');

        const maxDeadline = new Date();
        maxDeadline.setHours(23, 59, 59, 999);

        // If your database stores dates in UTC and you want "today" based on UTC:
        // const maxDeadlineUTC = new Date();
        // maxDeadlineUTC.setUTCHours(23, 59, 59, 999);
        // console.log(`maxDeadline (UTC end of day): ${maxDeadlineUTC.toISOString()}`);
        // Use maxDeadlineUTC if that's the case. For this example, we'll use local server time.

        const result = await getTasksFromUserId(
            numericUserId,
            minDeadline,
            maxDeadline
        );

        return {
            tasks: result,
        };
    } catch (error) {
        console.error('Error in returnTodayTask:', error);
        throw error;
    }
}

export { createTask, returnTodayTask };
