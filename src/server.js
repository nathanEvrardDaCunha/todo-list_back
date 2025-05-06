// "Error Cannot find package X..." => add "./" prefix
import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import { pool, testConnection, initDatabase } from './database.js';
import cors from 'cors';

// Start Up
// TO-NOTE: dotenv only work when the server.js file is launch from the root folder (e.g: "node src/server.js")
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const jsonTest = {
    title: "Basic api route's test to see if json work perfectly",
    name: 'Camelia',
    age: 34,
    skills: ['communication', 'react'],
};

app.get('/api', (req, res) => {
    res.status(200).json(jsonTest);
});

app.use('/api/auth', authRouter);

// Database test route
app.get('/api/db-test', async (req, res) => {
    try {
        // Test actual connection
        const client = await pool.connect();

        // Get database info
        const dbNameResult = await client.query('SELECT current_database()');
        const versionResult = await client.query('SELECT version()');

        // await client.query(
        //     'INSERT INTO users (id, username, email, password) VALUES (100, "philip", "philip.gustave@example.com", "Azerty123!")'
        // );

        // // TO-NOTE: Here lies a prepared query.
        // // await pool.query('INSERT INTO schools (name, address) VALUES ($1, $2)', [name, location])

        // const userTable = await client.query(
        //     'SELECt * FROM users WHERE username="philip"'
        // );

        // ...existing code...
        // TO-DO: Increment automatically PRIMARY KEY
        await client.query(
            "INSERT INTO users (id, username, email, password) VALUES (110, 'marcel', 'marcel.gustave@example.com', 'Azerty123!')"
        );

        const userTable = await client.query(
            "SELECT * FROM users WHERE username = 'marcel'"
        );
        // ...existing code...

        // Release the client back to the pool
        client.release();

        res.status(200).json({
            status: 'success',
            message: 'Database connection successful',
            details: {
                database: dbNameResult.rows[0].current_database,
                version: versionResult.rows[0].version,
                userTable: userTable.rows,
                host: process.env.DATABASE_HOST,
                port: process.env.DATABASE_PORT,
            },
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

// app.all('*', (req, res) => {
//     res.status(404).json({
//         status: 'error',
//         message: `Cannot find ${req.method} ${req.originalUrl} on this server`
//     });
// });

app.use(errorHandler);

// app.listen(process.env.APP_PORT, () =>
//     console.log(
//         `The todo-list server is running on: ${process.env.APP_URL}${process.env.APP_PORT}.`
//     )
// );

// Initialize the app
const startServer = async () => {
    try {
        // Test database connection
        const dbConnected = await testConnection();

        if (dbConnected) {
            // Initialize database tables
            await initDatabase();

            // Start the server
            app.listen(process.env.APP_PORT, () => {
                console.log('TESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSST');
                console.log(`Server running in ${process.env.NODE_ENV} mode`);
                console.log(
                    `API available at: ${process.env.APP_URL}${process.env.APP_PORT}`
                );
            });
        } else {
            console.error(
                'Could not connect to database. Please check your configuration.'
            );
            process.exit(1);
        }
    } catch (error) {
        console.error('Server initialization failed:', error);
        process.exit(1);
    }
};

// Start the server
startServer();
