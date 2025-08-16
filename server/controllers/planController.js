import Profile from '../models/Profile.js';
import Plan from '../models/Plan.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Generate a wellness plan
// @route   POST /api/plan/generate
const generatePlan = async (req, res) => {
  try {
    // 1. Get the user's profile
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found. Please complete onboarding first.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    // 2. Construct a detailed prompt for the AI
    const prompt = `
  You are an expert nutritionist and personal trainer creating a hyper-detailed plan. A user has the following profile:
  - Goal: ${profile.goal}
  - Dietary Preference: ${profile.diet}
  - Activity Level: ${profile.activityLevel}
  - Health Notes: ${profile.healthNotes || 'None'}

  Generate a comprehensive, structured 4-week (28-day) wellness plan.
  Your response MUST be a single, minified JSON object. Do not include any text or markdown outside the JSON.
  The JSON object must have a key "weeklyPlan", an array of 4 week objects.
  Each week object must have "dailyPlan", an array of 7 day objects.
  Each day object must have:
  1. "day" (e.g., "Day 1").
  2. "meals" (an object with "breakfast", "lunch", "dinner", "snack" keys). Each meal object must contain "name" (e.g., "Oatmeal with Berries"), "calories" (number), "protein" (number), "carbs" (number), and "fat" (number).
  3. "exercise" (an object with "activity", "duration", and "caloriesBurned" (number) keys).
  4. "dailyTotals" (an object with "totalCalories", "totalProtein", "totalCarbs", "totalFat" keys, summing up the meals).

  Provide realistic, healthy, and varied suggestions. All nutritional values must be estimates.
`;


    // 3. Call the AI
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponseText = response.text();
    const cleanedJsonString = aiResponseText.replace("```json", "").replace("```", "").trim();
    const planJSON = JSON.parse(cleanedJsonString);

    // 4. Save the plan to the database
    const plan = await Plan.findOneAndUpdate(
      { user: req.user._id },
      { planData: planJSON },
      { new: true, upsert: true }
    );

    res.status(201).json(plan);

  } catch (error) {
    console.error('Error generating plan:', error);
    res.status(500).json({ message: 'Failed to generate plan due to a server error.' });
  }
};

export { generatePlan };