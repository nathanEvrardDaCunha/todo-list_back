import express from 'express';
import {
    createTaskController,
    fetTodayTaskController,
} from '../controllers/taskControllers.js';

const taskRouter = express.Router();

taskRouter.route('/task').post(createTaskController);

taskRouter.route('/today').get(fetTodayTaskController);

export default taskRouter;
