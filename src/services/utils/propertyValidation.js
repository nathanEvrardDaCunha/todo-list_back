// ============ NULLISH VALIDATION ============

/**
 * Check if value is undefined
 *
 * @export
 * @param {*} value
 * @return {boolean}
 */
export function isUndefined(value) {
    return value === undefined;
}

/**
 * Check if value is null
 *
 * @export
 * @param {*} value
 * @return {boolean}
 */
export function isNull(value) {
    return value === null;
}

/**
 * Check if value is null or undefined
 *
 * @export
 * @param {*} value
 * @return {boolean}
 */
export function isNullish(value) {
    return value == null;
}

// ============ TYPE VALIDATION ============

/**
 * Check if value is a string
 *
 * @export
 * @param {*} value
 * @return {boolean}
 */
export function isString(value) {
    return typeof value === 'string';
}

/**
 * Check if value is a number (excluding NaN)
 *
 * @export
 * @param {*} value
 * @return {boolean}
 */
export function isNumber(value) {
    return typeof value === 'number' && !Number.isNaN(value);
}

/**
 * Check if value is a boolean
 *
 * @export
 * @param {*} value
 * @return {boolean}
 */
export function isBoolean(value) {
    return typeof value === 'boolean';
}

/**
 * Check if value is a Date object
 *
 * @export
 * @param {*} value
 * @return {boolean}
 */
export function isDate(value) {
    return value instanceof Date;
}

/**
 * Check if value is an Array
 *
 * @export
 * @param {*} value
 * @return {boolean}
 */
export function isArray(value) {
    return Array.isArray(value);
}

/**
 * Check if value is a plain object (not null, not array, not date)
 *
 * @export
 * @param {*} value
 * @return {boolean}
 */
export function isObject(value) {
    return (
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date)
    );
}

// ============ STRING VALIDATION ============

/**
 * Check if string is an empty string
 *
 * @export
 * @param {string} value
 * @return {boolean}
 */
export function isEmptyString(value) {
    return value === '';
}

/**
 * Check if string contains only whitespace (including empty string)
 *
 * @export
 * @param {string} value
 * @return {boolean}
 */
export function isWhitespaceString(value) {
    return value.trim() === '';
}

/**
 * Check if string is shorter than the specified length
 *
 * @export
 * @param {string} value
 * @param {number} minLength
 * @return {boolean}
 */
export function isShorterThan(value, minLength) {
    return value.length < minLength;
}

/**
 * Check if string is longer than the specified length
 *
 * @export
 * @param {string} value
 * @param {number} maxLength
 * @return {boolean}
 */
export function isLongerThan(value, maxLength) {
    return value.length > maxLength;
}

/**
 * Check if string matches the username regex pattern
 *
 * @export
 * @param {string} value
 * @return {boolean}
 */
export function isUsernameValid(value) {
    return /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/.test(value);
}

/**
 * Check if string matches the email regex pattern
 *
 * @export
 * @param {string} value
 * @return {boolean}
 */
export function isEmailValid(value) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
}

/**
 * Check if string matches the password regex pattern
 *
 * @export
 * @param {string} value
 * @return {boolean}
 */
export function isPasswordValid(value) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/.test(
        value
    );
}

/**
 * Check if string matches the title regex pattern
 *
 * @export
 * @param {string} value
 * @return {boolean}
 */
export function isTitleValid(value) {
    return /^[A-Za-z0-9 !@#$%&*_-]+$/.test(value);
}

/**
 * Check if string matches the description regex pattern
 *
 * @export
 * @param {string} value
 * @return {boolean}
 */
export function isDescriptionValid(value) {
    return /^[A-Za-z0-9 !@#$%&*_\n\\-]+$/.test(value);
}

/**
 * Check if string matches the project regex pattern (letters and spaces only)
 *
 * @export
 * @param {string} value
 * @return {boolean}
 */
export function isProjectValid(value) {
    return /^[A-Za-z\s]*$/.test(value);
}

// ============ NUMBER VALIDATION ============

/**
 * Check if number is NaN
 *
 * @export
 * @param {number} value
 * @return {boolean}
 */
export function isNaN(value) {
    return Number.isNaN(value);
}

/**
 * Check if number is zero
 *
 * @export
 * @param {number} value
 * @return {boolean}
 */
export function isZero(value) {
    return value === 0;
}

/**
 * Check if number is positive (greater than 0)
 *
 * @export
 * @param {number} value
 * @return {boolean}
 */
export function isPositive(value) {
    return value > 0;
}

/**
 * Check if number is negative (less than 0)
 *
 * @export
 * @param {number} value
 * @return {boolean}
 */
export function isNegative(value) {
    return value < 0;
}

/**
 * Check if number is an integer
 *
 * @export
 * @param {number} value
 * @return {boolean}
 */
export function isInteger(value) {
    return Number.isInteger(value);
}

// ============ BOOLEAN VALIDATION ============

/**
 * Check if boolean is exactly false
 *
 * @export
 * @param {boolean} value
 * @return {boolean}
 */
export function isFalse(value) {
    return value === false;
}

/**
 * Check if boolean is exactly true
 *
 * @export
 * @param {boolean} value
 * @return {boolean}
 */
export function isTrue(value) {
    return value === true;
}

// ============ ARRAY VALIDATION ============

/**
 * Check if array is empty
 *
 * @export
 * @param {Array} value
 * @return {boolean}
 */
export function isEmptyArray(value) {
    return value.length === 0;
}

/**
 * Check if array has only one element
 *
 * @export
 * @param {Array} value
 * @return {boolean}
 */
export function isSingleElementArray(value) {
    return value.length === 1;
}

/**
 * Check if array contains only unique elements
 *
 * @export
 * @param {Array} value
 * @return {boolean}
 */
export function hasUniqueElements(value) {
    return new Set(value).size === value.length;
}

// ============ OBJECT VALIDATION ============

/**
 * Check if object is empty (has no own properties)
 *
 * @export
 * @param {Object} value
 * @return {boolean}
 */
export function isEmptyObject(value) {
    return Object.keys(value).length === 0;
}

/**
 * Check if object has only one property
 *
 * @export
 * @param {Object} value
 * @return {boolean}
 */
export function isSinglePropertyObject(value) {
    return Object.keys(value).length === 1;
}

// ============ DATE VALIDATION ============

/**
 * Check if Date object is valid (not Invalid Date)
 *
 * @export
 * @param {Date} value
 * @return {boolean}
 */
export function isValidDate(value) {
    return !Number.isNaN(value.getTime());
}

/**
 * Check if Date is in the past
 *
 * @export
 * @param {Date} value
 * @return {boolean}
 */
export function isPastDate(value) {
    return value < new Date();
}

/**
 * Check if Date is in the future
 *
 * @export
 * @param {Date} value
 * @return {boolean}
 */
export function isFutureDate(value) {
    return value > new Date();
}

/**
 * Check if Date is today
 *
 * @export
 * @param {Date} value
 * @return {boolean}
 */
export function isToday(value) {
    const today = new Date();
    return value.toDateString() === today.toDateString();
}

// ============ CONVERSION VALIDATION ============

/**
 * Check if value can be converted to a valid number
 *
 * @export
 * @param {*} value
 * @return {boolean}
 */
export function isNumberValid(value) {
    return !Number.isNaN(Number(value)) && value !== '' && value !== null;
}

/**
 * Check if value can be converted to a valid Date
 *
 * @export
 * @param {*} value
 * @return {boolean}
 */
export function isDateValid(value) {
    const date = new Date(value);
    return date instanceof Date && !Number.isNaN(date.getTime());
}
