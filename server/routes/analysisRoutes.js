
import express from 'express';
const router = express.Router();
import analyzeIngredients from '../controllers/analysisController.js';

// Define the route: POST /api/analyze
router.post('/analyze', analyzeIngredients);

export default router;