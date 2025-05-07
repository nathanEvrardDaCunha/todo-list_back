// "Error Cannot find package X..." => add "./" prefix
import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import {
    pool,
    establishDatabaseConnection,
    initializeDatabase,
} from './builds/database.js';

// Start Up
// TO-NOTE: dotenv only work when the server.js file is launch from the root folder (e.g: "node src/server.js")
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const jsonTest = {
    title: "Basic api route's test to see if json work perfectly",
    name: 'Camelia',
    age: 34,
    skills: ['communication', 'react'],
};

app.get('/api', (req, res) => {
    res.status(200).json(jsonTest);
});

// app.use('/api/auth', authRouter);

// === TEMPORARY === //

import bcrypt from 'bcrypt';

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

const hashPassword = async (plainPassword) =>
    await bcrypt.hash(
        plainPassword,
        parseInt(process.env.BCRYPT_HASHING_ROUND)
    );
const isPasswordMatch = async (plainPassword, hashedPassword) =>
    await bcrypt.compare(plainPassword, hashedPassword);

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

app.post('/api/register', async (req, res, next) => {
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

        // SECURITY: Hash user password
        const plainPassword = req.body.password;
        const hashedPassword = await hashPassword(plainPassword);

        // TO-DO: Create new user in database, with hashed password.
        // TO-CONSIDER: Create default "welcome" task for new user ?
        // TO-DO: Create token with JWT.
        // TO-DO: Send back JWT token to user.
        // TO-DO: Throw error if there is a problem along the way.
        // TO-NOTE: Might require the function to become async.
        // TO-DO: Make SQL query prepared to avoid SQL injection attacks.

        res.status(200).send(`Register route work fine.`);
    } catch (error) {
        next(error);
    }
});

// TO-CONSIDER: Implement small fixed windows limiter (prevent spam) ?
app.post('/api/login', async (req, res, next) => {
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

        // SECURITY: Hash user password
        const plainPassword = req.body.password;
        const hashedPassword = await hashPassword(plainPassword);

        // TO-DO: Hash database user password.

        // TO-DO: Compare hashed password with user's password stored in database.
        // TO-DO: Create token with JWT.
        // TO-DO: Send back JWT token to user.
        // TO-DO: Throw error if there is a problem along the way.
        // TO-NOTE: Might require the function to become async.
        // TO-DO: Make SQL query prepared to avoid SQL injection attacks.

        res.status(200).send(`Login route work fine.`);
    } catch (error) {
        next(error);
    }
});

// +++ END TEMPORARY +++ //

app.get('/api/db', async (req, res) => {
    try {
        const client = await pool.connect();

        const dbNameResult = await client.query('SELECT current_database()');
        const versionResult = await client.query('SELECT version()');

        // // TO-NOTE: Here lies a prepared query.
        // // await pool.query('INSERT INTO schools (name, address) VALUES ($1, $2)', [name, location])

        // TO-DO: Increment automatically PRIMARY KEY
        await client.query(
            `INSERT into users (username, email, password) VALUES ('jean-luc3', 'jean-luc2@example.com', 'Azerty11!')`
        );

        const result = await client.query(
            `SELECT * from users WHERE username='jean-luc3'`
        );

        client.release();

        res.status(200).json({
            status: 'success',
            message: 'Database connection successful',
            details: {
                database: dbNameResult.rows[0].current_database,
                version: versionResult.rows[0].version,
                host: process.env.DATABASE_HOST,
                port: process.env.DATABASE_PORT,
            },
            result: result,
        });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: error.message,
        });
    }
});

// TO-CONSIDER: Add "models" folder, if necessary
// TO-CONSIDER: Add "controllers" folder, if necessary
// TO-CONSIDER: Add "services" folder, if necessary
// Source: https://www.coreycleary.me/project-structure-for-an-express-rest-api-when-there-is-no-standard-way

// TO-DO: Implement default response for non existing route, no matter the method
// app.get('*')
// app.post('*')
// app.put('*')
// app.delete('*')

// TO-NOTE: The errorhandler need to be right before the end
// If not, it'll not work or return to express default error handling system
app.use(errorHandler);

// TO-CONSIDER: Move the code below to 'server.js' file in /build and rename this file 'index.js' everywhere ?
async function startServer() {
    try {
        const isConnectionEstablished = await establishDatabaseConnection();

        if (!isConnectionEstablished) {
            throw new Error(
                `Cannot establish connection to the database during server launch !`
            );
        }

        await initializeDatabase();

        // id SERIAL PRIMARY KEY,
        // username VARCHAR(50) NOT NULL UNIQUE,
        // email VARCHAR(150) NOT NULL UNIQUE,
        // password VARCHAR(200) NOT NULL,
        // created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        // updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        app.listen(process.env.APP_PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode.`);
            console.log(
                `API is running on: ${process.env.APP_URL}${process.env.APP_PORT}.`
            );
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

startServer();
