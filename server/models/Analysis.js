import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  userInput: {
    type: String,
    required: true,
    trim: true,
  },
  healthScore: {
    type: String,
    required: true,
  },
  nutritionalInfo: {
    calories: { type: String },
    protein: { type: String },
    carbs: { type: String },
    fat: { type: String },
  },
  beneficialIngredients: {
    type: [String], // An array of strings
  },
  ingredientsToWatch: {
    type: [String], // An array of strings
  },
  allergenAlerts: {
    type: [String], // An array of strings
  },
  summary: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;