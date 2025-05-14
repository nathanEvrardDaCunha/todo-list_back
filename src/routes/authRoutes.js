import express from 'express';
import {
    postRegister,
    postLogin,
    postLogout,
} from '../controllers/authControllers.js';

const authRouter = express.Router();

authRouter.route('/register').post(postRegister);

authRouter.route('/login').post(postLogin);

authRouter.route('/logout').post(postLogout);

export default authRouter;
