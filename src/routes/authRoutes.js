import express from 'express';

const authRouter = express.Router();

// TO-CONSIDER: Transfer these pure functions in one utility first file ?

const isFalsy = (value) => !value;
const isUndefined = (value) => value === undefined;
const isNotString = (value) => typeof value !== 'string';
const isShorterEqualThan = (value, shorterLength) => value < shorterLength;
const isLongerEqualThan = (value, higherLength) => value > higherLength;
const isLowerEqualThan = (value, lowerNumber) => value < lowerNumber;
const isHigherEqualThan = (value, higherNumber) => value < higherNumber;
const isNotEqual = (value, equalNumber) => value != equalNumber;
const isEmail = (value) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
const isStrongPassword = (value) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/.test(
        value
    );
const isUsernameValid = (value) => /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/.test(value);

// TO-NOTE: Better to do these four below when having a fully functional auth system.
// TO-CONSIDER: Add typescript without hot reload to avoid build problem ?
// TO-CONSIDER: Add test for each functions ?
// TO-CONSIDER: Divide the logics into services, routers and models ?
// TO-CONSIDER: Make SQL query prepared to avoid SQL injection attacks.
const validateStringProperty = (value, valueName, minLength, maxLength) => {
    if (isUndefined(value)) {
        return new Error(`Cannot process undefined ${valueName} property !`);
    }

    if (isNotString(value)) {
        return new Error(`Cannot process non-string ${valueName} property !`);
    }

    if (isShorterEqualThan(value.length, minLength)) {
        return new Error(
            `Cannot process ${valueName} property shorter than ${minLength} characters !`
        );
    }

    if (isLongerEqualThan(value.length, maxLength)) {
        return new Error(
            `Cannot process ${valueName} property longer than ${maxLength} characters !`
        );
    }

    return true;
};

// TO-CONSIDER: Implement small fixed windows limiter (prevent spam) ?
authRouter.post('/login', (req, res, next) => {
    try {
        // SECURITY: Verify JSON body
        if (isFalsy(req.body)) {
            throw new Error(`Cannot process undefined request body !`);
        }

        if (isNotEqual(Object.keys(req.body).length, 3)) {
            throw new Error(`Cannot process request body of the wrong size !`);
        }

        // SECURITY: Verify username property
        const MIN_USERNAME_LENGTH = 5;
        const MAX_USERNAME_LENGTH = 50;
        const usernameError = validateStringProperty(
            req.body.username,
            'username',
            MIN_USERNAME_LENGTH,
            MAX_USERNAME_LENGTH
        );

        if (!isUsernameValid(req.body.username)) {
            throw new Error(
                `Cannot process non-valid username ! Only letters, numbers and hyphen are allowed.`
            );
        }

        if (usernameError instanceof Error) {
            throw usernameError;
        }

        // SECURITY: Verify email property
        const MIN_EMAIL_LENGTH = 6;
        const MAX_EMAIL_LENGTH = 150;
        const emailError = validateStringProperty(
            req.body.email,
            'email',
            MIN_EMAIL_LENGTH,
            MAX_EMAIL_LENGTH
        );

        if (!isEmail(req.body.email)) {
            throw new Error(`Cannot process non-standard email property !`);
        }

        if (emailError instanceof Error) {
            throw emailError;
        }

        // SECURITY: Verify password property
        const MIN_PASSWORD_LENGTH = 6;
        const MAX_PASSWORD_LENGTH = 200;
        const passwordError = validateStringProperty(
            req.body.password,
            'password',
            MIN_PASSWORD_LENGTH,
            MAX_PASSWORD_LENGTH
        );

        if (!isStrongPassword(req.body.password)) {
            throw new Error(
                `Cannot process weak password ! It should have one uppercase, lowercase, number, special character, and be at least 6 characters long.`
            );
        }

        if (passwordError instanceof Error) {
            throw passwordError;
        }

        // TO-DO: Hash password.
        // SECURITY: Hash user password

        // TO-DO: Create new user in database, with hashed password.
        // TO-CONSIDER: Create default "welcome" task for new user ?
        // TO-DO: Create token with JWT.
        // TO-DO: Send back JWT token to user.
        // TO-DO: Throw error if there is a problem along the way.
        // TO-NOTE: Might require the function to become async.
        // TO-DO: Make SQL query prepared to avoid SQL injection attacks.

        res.status(200).send(`Login route work fine`);
    } catch (error) {
        next(error);
    }
});

// TO-CONSIDER: Implement small fixed windows limiter (prevent spam) ?
authRouter.post('/register', (req, res, next) => {
    try {
        // SECURITY: Verify JSON body
        if (isFalsy(req.body)) {
            throw new Error(`Cannot process undefined request body !`);
        }

        if (isNotEqual(Object.keys(req.body).length, 2)) {
            throw new Error(`Cannot process request body of the wrong size !`);
        }

        // SECURITY: Verify email property
        const MIN_EMAIL_LENGTH = 6;
        const MAX_EMAIL_LENGTH = 150;
        const emailError = validateStringProperty(
            req.body.email,
            'email',
            MIN_EMAIL_LENGTH,
            MAX_EMAIL_LENGTH
        );

        if (!isEmail(req.body.email)) {
            throw new Error(`Cannot process non-standard email property !`);
        }

        if (emailError instanceof Error) {
            throw emailError;
        }

        // SECURITY: Verify password property
        const MIN_PASSWORD_LENGTH = 6;
        const MAX_PASSWORD_LENGTH = 200;
        const passwordError = validateStringProperty(
            req.body.password,
            'password',
            MIN_PASSWORD_LENGTH,
            MAX_PASSWORD_LENGTH
        );

        if (!isStrongPassword(req.body.password)) {
            throw new Error(
                `Cannot process weak password ! It should have one uppercase, lowercase, number, special character, and be at least 6 characters long.`
            );
        }

        if (passwordError instanceof Error) {
            throw passwordError;
        }

        // TO-DO: Find if user exist in database.
        // TO-DO: Hash password.
        // TO-DO: Compare hashed password with user's password stored in database.
        // TO-DO: Create token with JWT.
        // TO-DO: Send back JWT token to user.
        // TO-DO: Throw error if there is a problem along the way.
        // TO-NOTE: Might require the function to become async.
        // TO-DO: Make SQL query prepared to avoid SQL injection attacks.

        res.status(200).send(`Register route work fine`);
    } catch (error) {
        next(error);
    }
});

export default authRouter;
