import express from 'express';
const router = express.Router();
import { analyzeIngredients, getAnalysisHistory, getAnalysisById } from '../controllers/analysisController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/analyze', protect, analyzeIngredients);
router.get('/history', protect, getAnalysisHistory);
router.get('/history/:id', protect, getAnalysisById);

export default router;