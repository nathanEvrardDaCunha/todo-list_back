import express from 'express';
import { getTodayTasks, createTask } from '../controllers/taskControllers.js';

const taskRouter = express.Router();

// Remove ?userId parameter - get from JWT token instead
taskRouter.route('/today').get(getTodayTasks);
taskRouter.route('/task').post(createTask);

export default taskRouter;
