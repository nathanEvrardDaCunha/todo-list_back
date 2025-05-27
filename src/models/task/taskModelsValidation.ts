import { UnprocessableContentError } from '../../utils/errors/ClientError.js';
import {
    isBoolean,
    isDate,
    isNumber,
    isString,
} from '../../utils/validation/genericValidation.js';

export interface TaskDB {
    id: number;
    title: string;
    description: string;
    project: string;
    deadline: Date;
    completed: boolean;
}

function validateIsNumber(value: any, valueName: string): number {
    // Server Error because it come from Database
    if (!isNumber(value)) {
        throw new UnprocessableContentError(
            `${valueName} is not of type number !`
        );
    }
    return value;
}

function validateIsString(value: any, valueName: string): string {
    // Server Error because it come from Database
    if (!isString(value)) {
        throw new UnprocessableContentError(
            `${valueName} is not of type string !`
        );
    }
    return value;
}

function validateIsDate(value: any, valueName: string): Date {
    // Server Error because it come from Database
    if (!isDate(value)) {
        throw new UnprocessableContentError(
            `${valueName} is not of type Date !`
        );
    }
    return value;
}

function validateIsBoolean(value: any, valueName: string): boolean {
    // Server Error because it come from Database
    if (!isBoolean(value)) {
        throw new UnprocessableContentError(
            `${valueName} is not of type boolean !`
        );
    }
    return value;
}

export function validateTaskDB(
    id: any,
    title: any,
    description: any,
    project: any,
    deadline: any,
    completed: any
): TaskDB {
    const newId = validateIsNumber(id, 'id');
    const newTitle = validateIsString(title, 'title');
    const newDescription = validateIsString(description, 'description');
    const newProject = validateIsString(project, 'project');
    const newDeadline = validateIsDate(deadline, 'deadline');
    const newCompleted = validateIsBoolean(completed, 'completed');

    const result: TaskDB = {
        id: newId,
        title: newTitle,
        description: newDescription,
        project: newProject,
        deadline: newDeadline,
        completed: newCompleted,
    };

    return result;
}
