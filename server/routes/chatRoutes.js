import express from 'express';
const router = express.Router();
import { handleChatMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, handleChatMessage);

export default router;