import express, { Router } from 'express';
import { registerController, loginController, logoutController } from '../controllers/authControllers.js';

const authRouter: Router = express.Router();

authRouter.route('/register').post(registerController);

authRouter.route('/login').post(loginController);

authRouter.route('/logout').post(logoutController);

export default authRouter;
