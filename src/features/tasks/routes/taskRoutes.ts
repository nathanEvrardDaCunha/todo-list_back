import express, { Router } from 'express';
import {
    completeSingleTaskController,
    createTaskController,
    fetchTodayTaskController,
} from '../controllers/taskControllers.js';

const taskRouter: Router = express.Router();

taskRouter.route('/task').post(createTaskController);

taskRouter.route('/today').get(fetchTodayTaskController);

taskRouter.route('/:id/complete').patch(completeSingleTaskController);

export default taskRouter;
