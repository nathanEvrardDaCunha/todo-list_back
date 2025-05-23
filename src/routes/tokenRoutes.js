import express from 'express';
import cookieParser from 'cookie-parser';
import { refreshAccessToken } from '../controllers/tokenControllers.js';

const tokenRouter = express.Router();

tokenRouter.use(cookieParser());

tokenRouter.route('/token').get(refreshAccessToken);

export default tokenRouter;
