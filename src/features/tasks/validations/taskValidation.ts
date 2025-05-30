import { DB_TASK } from '../../../builds/databaseConstants.js';
import { UnprocessableContentError } from '../../../utils/errors/ClientError.js';
import {
    isDateValid,
    isDescriptionValid,
    isInteger,
    isNumberValid,
    isPositive,
    isProjectValid,
    isTitleValid,
    isWhitespaceString,
    validatePossiblyEmptyStringProperty,
    validateStringProperty,
} from '../../../utils/validation/genericValidation.js';

export function validateTitle(title: unknown): string {
    const result = validateStringProperty(
        title,
        'Title',
        DB_TASK.MIN_TITLE_LENGTH,
        DB_TASK.MAX_TITLE_LENGTH
    );
    if (!isTitleValid(result)) {
        throw new UnprocessableContentError('Title is invalid !');
    }
    return result;
}

export function validateDescription(description: unknown): string {
    const result = validatePossiblyEmptyStringProperty(
        description,
        'Description'
    );
    if (!isWhitespaceString(result)) {
        if (!isDescriptionValid(result)) {
            throw new UnprocessableContentError('Description is invalid !');
        }
    }
    return result;
}

export function validateProject(project: unknown): string {
    const result = validatePossiblyEmptyStringProperty(project, 'Project');
    if (!isWhitespaceString(result)) {
        if (!isProjectValid(result)) {
            throw new UnprocessableContentError('Project is invalid !');
        }
    }
    return result;
}

export function validateDeadline(deadline: unknown): string {
    const result = validateStringProperty(
        deadline,
        'Deadline',
        DB_TASK.MIN_DEADLINE_LENGTH,
        DB_TASK.MAX_DEADLINE_LENGTH
    );
    if (!isDateValid(result)) {
        throw new UnprocessableContentError('Deadline is invalid !');
    }
    return result;
}

export function validateTaskId(taskId: unknown): number {
    const result = validateStringProperty(
        taskId,
        'TaskId',
        DB_TASK.MIN_TASK_ID_LENGTH,
        DB_TASK.MAX_TASK_ID_LENGTH
    );
    if (!isNumberValid(result)) {
        throw new UnprocessableContentError('TaskId is an invalid number !');
    }
    const newResult = parseInt(result);
    if (!isPositive(newResult)) {
        throw new UnprocessableContentError('TaskId is a negative number !');
    }
    if (!isInteger(newResult)) {
        throw new UnprocessableContentError('TaskId is a non-integer number !');
    }
    return newResult;
}
