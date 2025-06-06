import express, { Router } from 'express';
import {
    changePasswordController,
    fetchUserController,
} from '../controllers/userControllers.js';

const userRouter: Router = express.Router();

userRouter.route('/').get(fetchUserController);

userRouter.route('/password').patch(changePasswordController);

export default userRouter;
