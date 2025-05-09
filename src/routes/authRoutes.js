import express from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { pool } from '../builds/database.js';
import jwt from 'jsonwebtoken';

dotenv.config();

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

// TO-DO: Validate my environment properties are defined, else, create fallback values.
async function hashPassword(plainPassword) {
    try {
        return bcrypt.hash(
            plainPassword,
            parseInt(process.env.BCRYPT_HASHING_ROUND)
        );
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Password hashing failed');
    }
}

async function isPasswordMatch(plainPassword, hashedPassword) {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw new Error('Password comparison failed');
    }
}

// TO-NOTE: Better to do these four below when having a fully functional auth system.
// TO-CONSIDER: Add typescript without hot reload to avoid build problem ?
// TO-CONSIDER: Add test for each functions ?

// TO-CONSIDER: Could return just true or false and then handle error outside, in a try catch ?
function validateStringProperty(value, valueName, minLength, maxLength) {
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
}

async function isUsernameTaken(username) {
    const client = await pool.connect();

    const result = await client.query(`SELECT * FROM users WHERE username=$1`, [
        username,
    ]);

    client.release();

    const zeroUsernameFound = 0;
    if (result.rows.length > zeroUsernameFound) {
        return true;
    }

    return false;
}

async function isEmailTaken(email) {
    const client = await pool.connect();

    const result = await client.query(`SELECT * FROM users WHERE email=$1`, [
        email,
    ]);

    client.release();

    const zeroEmailFound = 0;
    if (result.rows.length > zeroEmailFound) {
        return true;
    }

    return false;
}

async function postUser(username, email, hashedPassword, refreshToken) {
    const client = await pool.connect();

    await client.query(
        `INSERT INTO users (username, email, password, refresh_token) VALUES ($1, $2, $3, $4)`,
        [username, email, hashedPassword, refreshToken]
    );

    client.release();
}

async function getUserByEmail(email) {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE email = $1', [
        email,
    ]);
    client.release();
    return result.rows[0];
}

async function updateRefreshTokenByUserId(refreshToken, userId) {
    const client = await pool.connect();
    await client.query(`UPDATE users SET refresh_token = $1 WHERE id = $2`, [
        refreshToken,
        userId,
    ]);
    client.release();
}

// TO-CONSIDER: Implement small fixed windows limiter (prevent spam) ?
authRouter.post('/register', async (req, res, next) => {
    try {
        if (isFalsy(req.body)) {
            throw new Error(`Cannot process undefined request body !`);
        }

        if (isNotEqual(Object.keys(req.body).length, 3)) {
            throw new Error(`Cannot process request body of the wrong size !`);
        }

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

        const databaseEmail = await isEmailTaken(req.body.email);
        if (databaseEmail) {
            throw new Error(
                `Cannot process sign-up because email is already present in database !`
            );
        }

        const databaseUsername = await isUsernameTaken(req.body.username);
        if (databaseUsername) {
            throw new Error(
                `Cannot process sign-up because username is already present in database !`
            );
        }

        const hashedPassword = await hashPassword(req.body.password);

        await postUser(
            req.body.username,
            req.body.email,
            hashedPassword,
            process.env.TEMPORARY_TOKEN
        );

        const user = await getUserByEmail(req.body.email);

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN,
            { expiresIn: '14d' }
        );

        updateRefreshTokenByUserId(refreshToken, user.id);

        // TO-CONSIDER: Create default "welcome" task for new user ?

        res.status(200).json({ message: 'Register route work now !' });
    } catch (error) {
        next(error);
    }
});

// TO-CONSIDER: Implement small fixed windows limiter (prevent spam) ?
authRouter.post('/login', async (req, res, next) => {
    try {
        if (isFalsy(req.body)) {
            throw new Error(`Cannot process undefined request body !`);
        }

        if (isNotEqual(Object.keys(req.body).length, 2)) {
            throw new Error(`Cannot process request body of the wrong size !`);
        }

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

        const user = await getUserByEmail(req.body.email);
        if (!user) {
            throw new Error('Invalid email or password!');
        }

        const passwordMatch = await isPasswordMatch(
            req.body.password,
            user.password
        );
        if (!passwordMatch) {
            throw new Error('Invalid email or password!');
        }

        const accessToken = jwt.sign(
            { id: user.id },
            process.env.ACCESS_TOKEN,
            { expiresIn: '30s' }
            // { expiresIn: '5m' }
        );
        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN,
            { expiresIn: '14d' }
        );

        await updateRefreshTokenByUserId(refreshToken, user.id);

        // TO-DO: Enable CORS to accept cookies
        // TO-CONSIDER: Add 'secure: true' for HTTPS ?
        // TO-CONSIDER: Add 'sameSite: strict' for something ?
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 14 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: 'Login successful!',
            accessToken: accessToken,
        });
    } catch (error) {
        next(error);
    }
});

// TO-CONSIDER: Add logout route ?

export default authRouter;
