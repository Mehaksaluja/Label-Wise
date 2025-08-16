import express from 'express';
const router = express.Router();
import { generatePlan } from '../controllers/planController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/generate').post(protect, generatePlan);

export default router;