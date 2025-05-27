import { DB_TASK } from '../../../builds/databaseConstants.js';
import { UnprocessableContentError } from '../../../utils/errors/ClientError.js';
import {
    isDateValid,
    isDescriptionValid,
    isProjectValid,
    isTitleValid,
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
    const result = validateStringProperty(
        description,
        'Description',
        DB_TASK.MIN_DESCRIPTION_LENGTH,
        DB_TASK.MAX_DESCRIPTION_LENGTH
    );
    if (!isDescriptionValid(result)) {
        throw new UnprocessableContentError('Description is invalid !');
    }
    return result;
}

export function validateProject(project: unknown): string {
    const result = validateStringProperty(
        project,
        'Project',
        DB_TASK.MIN_PROJECT_LENGTH,
        DB_TASK.MAX_PROJECT_LENGTH
    );
    if (!isProjectValid(result)) {
        throw new UnprocessableContentError('Project is invalid !');
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
        throw new UnprocessableContentError('Password is invalid !');
    }
    return result;
}
