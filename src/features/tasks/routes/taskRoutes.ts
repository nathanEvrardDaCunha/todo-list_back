import express, { Router } from 'express';
import {
    createTaskController,
    fetchTodayTaskController,
} from '../controllers/taskControllers.js';

const taskRouter: Router = express.Router();

taskRouter.route('/task').post(createTaskController);

taskRouter.route('/today').get(fetchTodayTaskController);

export default taskRouter;
