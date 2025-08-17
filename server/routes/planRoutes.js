import express from 'express';
const router = express.Router();
import { generatePlan, getPlan } from '../controllers/planController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/generate').post(protect, generatePlan);
router.route('/').get(protect, getPlan);

export default router;