import express from 'express';
import { postTask, getTodayTask } from '../controllers/taskControllers.js';

const taskRouter = express.Router();

// Implement the one the frontend need to avoid boilerplate.

taskRouter.route('/task').post(postTask);

taskRouter.route('/today').get(getTodayTask);

export default taskRouter;
