// ============ NULLISH VALIDATION ============

export function isUndefined(value: unknown): value is undefined {
    return value === undefined;
}

export function isNull(value: unknown): value is null {
    return value === null;
}

export function isNullish(value: unknown): value is null | undefined {
    return value == null;
}

// ============ TYPE VALIDATION ============

export function isString(value: unknown): value is string {
    return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
    return typeof value === 'number' && !Number.isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
}

export function isDate(value: unknown): value is Date {
    return value instanceof Date;
}

export function isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
}

export function isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date);
}

// ============ STRING VALIDATION ============

export function isEmptyString(value: string): boolean {
    return value === '';
}

export function isWhitespaceString(value: string): boolean {
    return value.trim() === '';
}

export function isShorterThan(value: string, minLength: number): boolean {
    return value.length < minLength;
}

export function isLongerThan(value: string, maxLength: number): boolean {
    return value.length > maxLength;
}

export function isUsernameValid(value: string): boolean {
    return /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/.test(value);
}

export function isEmailValid(value: string): boolean {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
}

export function isPasswordValid(value: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/.test(
        value
    );
}

export function isTitleValid(value: string): boolean {
    return /^[A-Za-z0-9 !@#$%&*_-]+$/.test(value);
}

export function isDescriptionValid(value: string): boolean {
    return /^[A-Za-z0-9 !@#$%&*_\n\\-]+$/.test(value);
}

export function isProjectValid(value: string): boolean {
    return /^[A-Za-z\s]*$/.test(value);
}

// ============ NUMBER VALIDATION ============

export function isNaN(value: number): boolean {
    return Number.isNaN(value);
}

export function isZero(value: number): boolean {
    return value === 0;
}

export function isPositive(value: number): boolean {
    return value > 0;
}

export function isNegative(value: number): boolean {
    return value < 0;
}

export function isInteger(value: number): boolean {
    return Number.isInteger(value);
}

// ============ BOOLEAN VALIDATION ============

export function isFalse(value: boolean): boolean {
    return value === false;
}

export function isTrue(value: boolean): boolean {
    return value === true;
}

// ============ ARRAY VALIDATION ============

export function isEmptyArray(value: unknown[]): boolean {
    return value.length === 0;
}

export function isSingleElementArray(value: unknown[]): boolean {
    return value.length === 1;
}

export function hasUniqueElements(value: unknown[]): boolean {
    return new Set(value).size === value.length;
}

// ============ OBJECT VALIDATION ============

export function isEmptyObject(value: Record<string, unknown>): boolean {
    return Object.keys(value).length === 0;
}

export function isSinglePropertyObject(value: Record<string, unknown>): boolean {
    return Object.keys(value).length === 1;
}

// ============ DATE VALIDATION ============

export function isValidDate(value: Date): boolean {
    return !Number.isNaN(value.getTime());
}

export function isPastDate(value: Date): boolean {
    return value < new Date();
}

export function isFutureDate(value: Date): boolean {
    return value > new Date();
}

export function isToday(value: Date): boolean {
    const today = new Date();
    return value.toDateString() === today.toDateString();
}

// ============ CONVERSION VALIDATION ============

export function isNumberValid(value: unknown): boolean {
    return !Number.isNaN(Number(value)) && value !== '' && value !== null;
}

export function isDateValid(value: unknown): boolean {
    const date = new Date(value as string | number | Date);
    return date instanceof Date && !Number.isNaN(date.getTime());
}
