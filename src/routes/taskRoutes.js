import express from 'express';
import { postTask } from '../controllers/taskControllers.js';

const taskRouter = express.Router();

// Implement the one the frontend need to avoid boilerplate.

taskRouter.route('/task').post(postTask);

export default taskRouter;
