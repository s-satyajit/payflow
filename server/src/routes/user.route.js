import express from 'express';
import { protectMiddleware } from '../middlewares/protect.middleware.js';
import { getUserDetails } from '../controllers/user.controller.js';
const router = express.Router();

router.get('/me', protectMiddleware, getUserDetails)

export default router;