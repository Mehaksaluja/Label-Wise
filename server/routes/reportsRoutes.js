import express from 'express';
const router = express.Router();
import { generateReport } from '../controllers/reportsController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/generate').post(protect, generateReport);

export default router;