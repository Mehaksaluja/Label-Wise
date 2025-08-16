import express from 'express';
const router = express.Router();
import {
  logOrUpdateProgress,
  logWeight,
  getDashboardData,
} from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

// All routes in this file are protected
router.use(protect);

router.post('/log', logOrUpdateProgress);
router.post('/weight', logWeight);
router.get('/dashboard', getDashboardData);

export default router;