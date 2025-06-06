import express, { Router } from 'express';
import { fetchUserController } from '../controllers/userControllers.js';

const userRouter: Router = express.Router();

userRouter.route('/').get(fetchUserController);

export default userRouter;
