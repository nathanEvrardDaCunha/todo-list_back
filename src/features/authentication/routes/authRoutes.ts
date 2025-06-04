import express, { Router } from 'express';
import {
    registerController,
    loginController,
    logoutController,
    resetPasswordController,
} from '../controllers/authControllers.js';

const authRouter: Router = express.Router();

authRouter.route('/register').post(registerController);

authRouter.route('/login').post(loginController);

authRouter.route('/logout').post(logoutController);

authRouter.route('/reset-password').post(resetPasswordController);

export default authRouter;
