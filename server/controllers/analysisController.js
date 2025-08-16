import Analysis from '../models/Analysis.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeIngredients = async (req, res) => {
  try {
    const { userInput } = req.body;

    // Basic validation
    if (!userInput) {
      return res.status(400).json({ message: 'User input is required.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const prompt = `
      You are a world-class nutritionist and food scientist. Analyze the following product ingredient list.
      Your response MUST be a single, minified JSON object. Do not include any text, markdown, or formatting outside of the JSON object.
      The JSON object must have these exact keys: "healthScore", "nutritionalInfo", "beneficialIngredients", "ingredientsToWatch", "allergenAlerts", "summary".
      - "healthScore": A letter grade from "A+" (excellent) to "F" (very poor).
      - "nutritionalInfo": An object with estimated "calories", "protein", "carbs", and "fat" as strings (e.g., "Approx. 150-200 kcal").
      - "beneficialIngredients": An array of strings listing healthy ingredients found.
      - "ingredientsToWatch": An array of strings listing ingredients of concern (e.g., preservatives, high sugar content).
      - "allergenAlerts": An array of strings listing common potential allergens found (e.g., "Contains Soy", "May contain nuts").
      - "summary": A concise, one-paragraph summary of your findings.

      Analyze this ingredient list: "${userInput}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponseText = response.text();

    // Clean the AI's response to remove the markdown code block fences
    const cleanedJsonString = aiResponseText
      .replace("```json", "")
      .replace("```", "")
      .trim();

    const parsedData = JSON.parse(cleanedJsonString);

    // Create a new document in the database
    const newAnalysis = new Analysis({
      userInput,
      healthScore: parsedData.healthScore,
      nutritionalInfo: parsedData.nutritionalInfo,
      beneficialIngredients: parsedData.beneficialIngredients,
      ingredientsToWatch: parsedData.ingredientsToWatch,
      allergenAlerts: parsedData.allergenAlerts,
      summary: parsedData.summary,
    });

    await newAnalysis.save();

    // Send the saved document back to the client
    res.status(201).json(newAnalysis);

  } catch (error) {
    console.error('Error in analyzeIngredients:', error);
    res.status(500).json({ message: 'Failed to analyze ingredients due to a server error.' });
  }
};

export default analyzeIngredients;