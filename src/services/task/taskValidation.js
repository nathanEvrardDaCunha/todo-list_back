import { DB_TASK } from '../../constants/database-constants.js';
import {
    isNullish,
    isString,
    isWhitespaceString,
    isShorterThan,
    isLongerThan,
    isTitleValid,
    isDescriptionValid,
    isProjectValid,
    isDateValid,
} from '../utils/propertyValidation.js';
import { ClientUnprocessableContentError } from '../../utils/errors/classes/ClientError.js';

// Console the error everywhere

// Rename the route, controller and anything everywhere

// Change the error everywhere

// Put the utils function in a utils files

// Write the JSDoc everywhere needed

// /**
//  * Check if password match hashed password
//  *
//  * @export
//  * @async
//  * @param {string} password
//  * @param {string} hashedPassword
//  * @return {Promise<boolean>}
//  */
// export async function isPasswordMatch(password, hashedPassword) {
//     try {
//         return await bcrypt.compare(password, hashedPassword);
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

// /**
//  * Return hashed password
//  *
//  * @export
//  * @async
//  * @param {string} password
//  * @return {Promise<string>}
//  */
// export async function hashPassword(password) {
//     try {
//         return await bcrypt.hash(
//             password,
//             parseInt(BCRYPT_CONFIGURATION.HASHING_ROUND)
//         );
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

// /**
//  * Validate value is a valid email
//  *
//  * @export
//  * @param {*} email
//  * @return {void}
//  */
// export function validateEmail(email) {
//     try {
//         validateStringProperty(
//             email,
//             'Email',
//             DB_USER.MIN_EMAIL_LENGTH,
//             DB_USER.MAX_EMAIL_LENGTH
//         );

//         if (!isEmailValid(email)) {
//             throw new ClientUnprocessableContentError(
//                 'Email possess a non-standard format !'
//             );
//         }
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

// /**
//  * Validate value is a valid username
//  *
//  * @export
//  * @param {*} username
//  * @return {void}
//  */
// export function validateUsername(username) {
//     try {
//         validateStringProperty(
//             username,
//             'Username',
//             DB_USER.MIN_USERNAME_LENGTH,
//             DB_USER.MAX_USERNAME_LENGTH
//         );

//         if (!isUsernameValid(username)) {
//             throw new ClientUnprocessableContentError(
//                 'Username is not valid !'
//             );
//         }
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

// /**
//  * Validate value is a valid password
//  *
//  * @export
//  * @param {*} password
//  * @return {void}
//  */
// export function validatePassword(password) {
//     try {
//         validateStringProperty(
//             password,
//             'Password',
//             DB_USER.MIN_PASSWORD_LENGTH,
//             DB_USER.MAX_PASSWORD_LENGTH
//         );

//         if (!isPasswordValid(password)) {
//             throw new ClientUnprocessableContentError(
//                 'Password is not strong enough !'
//             );
//         }
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

/**
 * Validate value is valid string property
 *
 * @param {*} value
 * @param {string} name
 * @param {number} minSize
 * @param {number} maxSize
 * @return {void}
 */
function validateStringProperty(value, name, minSize, maxSize) {
    try {
        if (isNullish(value)) {
            throw new ClientUnprocessableContentError(
                `${name} is undefined or null !`
            );
        }

        if (!isString(value)) {
            throw new ClientUnprocessableContentError(
                `${name} is not of type string !`
            );
        }

        if (isWhitespaceString(value)) {
            throw new ClientUnprocessableContentError(`${name} is empty !`);
        }

        if (isShorterThan(value, minSize)) {
            throw new ClientUnprocessableContentError(
                `${name} should be longer than ${minSize} characters !`
            );
        }

        if (isLongerThan(value, maxSize)) {
            throw new ClientUnprocessableContentError(
                `${name} should be shorter than ${maxSize} characters !`
            );
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Validate value is a valid title
 *
 * @export
 * @param {*} title
 * @return {void}
 */
export function validateTitle(title) {
    try {
        validateStringProperty(
            title,
            'title',
            DB_TASK.MIN_TITLE_LENGTH,
            DB_TASK.MAX_TITLE_LENGTH
        );

        if (!isTitleValid(title)) {
            throw new ClientUnprocessableContentError('Title is invalid !');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Validate value is a valid description
 *
 * @export
 * @param {*} description
 * @return {void}
 */
export function validateDescription(description) {
    try {
        validateStringProperty(
            description,
            'description',
            DB_TASK.MIN_DESCRIPTION_LENGTH,
            DB_TASK.MAX_DESCRIPTION_LENGTH
        );

        if (!isDescriptionValid(description)) {
            throw new ClientUnprocessableContentError(
                'Description is invalid !'
            );
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Validate value is a valid description
 *
 * @export
 * @param {*} project
 * @return {void}
 */
export function validateProject(project) {
    try {
        validateStringProperty(
            project,
            'project',
            DB_TASK.MIN_PROJECT_LENGTH,
            DB_TASK.MAX_PROJECT_LENGTH
        );

        if (!isProjectValid(project)) {
            throw new ClientUnprocessableContentError('Project is invalid !');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Validate value is a valid deadline
 *
 * @export
 * @param {*} deadline
 * @return {void}
 */
export function validateDeadline(deadline) {
    try {
        // if (isUndefined(deadline)) {
        //     throw new ClientError(
        //         `Invalid property`,
        //         `Cannot process undefined ${'deadline'} property !`,
        //         HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
        //     );
        // }

        // if (isNotString(deadline)) {
        //     throw new ClientError(
        //         `Invalid property`,
        //         `Cannot process non-string ${'deadline'} property !`,
        //         HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
        //     );
        // }

        validateStringProperty(
            deadline,
            'deadline',
            DB_TASK.MIN_DEADLINE_LENGTH,
            DB_TASK.MAX_DEADLINE_LENGTH
        );

        if (!isDateValid(deadline)) {
            throw new ClientUnprocessableContentError('Deadline is invalid !');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Don't use userId but accessToken instead
// function validateUserId(userId) {
//     try {
//         if (isUndefined(userId)) {
//             throw new ClientError(
//                 `Invalid property`,
//                 `Cannot process undefined ${'userId'} property !`,
//                 HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
//             );
//         }

//         if (isNotString(userId)) {
//             throw new ClientError(
//                 `Invalid property`,
//                 `Cannot process non-string ${'userId'} property !`,
//                 HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
//             );
//         }

//         // Will need to make it '!' instead

//         if (isNumberInvalid(userId)) {
//             throw new ClientError(
//                 `Invalid property`,
//                 `Cannot process invalid ${'userId'} as number !`,
//                 HTTP_CLIENT_CODE.UNPROCESSABLE_CONTENT
//             );
//         }
//     } catch (error) {
//         throw error;
//     }
// }
