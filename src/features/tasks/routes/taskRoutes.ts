import express, { Router } from 'express';
import {
    completeTaskController,
    createTaskController,
    deleteTaskController,
    fetchTodayTaskController,
    updateTaskController,
} from '../controllers/taskControllers.js';

const taskRouter: Router = express.Router();

taskRouter.route('/').post(createTaskController);

taskRouter.route('/:id').delete(deleteTaskController);

taskRouter.route('/:id').patch(updateTaskController);

taskRouter.route('/today').get(fetchTodayTaskController);

taskRouter.route('/:id/complete').patch(completeTaskController);

export default taskRouter;
