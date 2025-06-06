import express, { Router } from 'express';
import {
    changePasswordController,
    deleteUserController,
    fetchUserController,
    updateUserController,
} from '../controllers/userControllers.js';

const userRouter: Router = express.Router();

userRouter.route('/').get(fetchUserController);

userRouter.route('/').patch(updateUserController);

userRouter.route('/').delete(deleteUserController);

userRouter.route('/password').patch(changePasswordController);

export default userRouter;
