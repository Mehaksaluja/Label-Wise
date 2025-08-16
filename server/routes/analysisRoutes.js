const express = require('express');
const router = express.Router();
const { analyzeIngredients } = require('../controllers/analysisController');

// Define the route: POST /api/analyze
router.post('/analyze', analyzeIngredients);

module.exports = router;