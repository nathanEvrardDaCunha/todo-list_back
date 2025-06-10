import express from 'express';
import { sendContactMessageController } from '../controllers/contactControllers.js';

const router = express.Router();

router.post('/api/contact', sendContactMessageController);

export default router;
