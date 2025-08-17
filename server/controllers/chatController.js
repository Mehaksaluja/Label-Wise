import Profile from '../models/Profile.js';
import Plan from '../models/Plan.js';
import DailyProgress from '../models/DailyProgress.js';
import WeightLog from '../models/WeightLog.js';
import ConversationHistory from '../models/ConversationHistory.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const handleChatMessage = async (req, res) => {
  const { message } = req.body;
  const userId = req.user._id;

  if (!message) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  try {
    const [profile, plan, progress, weightLogs, conversation] = await Promise.all([
      Profile.findOne({ user: userId }),
      Plan.findOne({ user: userId }),
      DailyProgress.find({ user: userId }).sort({ date: -1 }),
      WeightLog.find({ user: userId }).sort({ date: -1 }),
      ConversationHistory.findOne({ user: userId }),
    ]);

    if (!profile || !plan) {
      return res.status(404).json({ message: 'User profile or plan not found. Please complete onboarding.' });
    }

    // --- THIS IS THE UPDATED, STRICTER PROMPT ---
    const systemInstruction = `
      You are Label-Wise, a friendly, expert AI wellness coach. Your goal is to help the user achieve their health goals.

      USER'S PROFILE:
      - Goal: ${profile.goal}
      - Diet: ${profile.diet}
      - Activity Level: ${profile.activityLevel}
      - Health Notes: ${profile.healthNotes || 'None'}

      Your personality is encouraging and supportive. Keep your responses concise and helpful.

      IMPORTANT: If you suggest a change to the user's daily meal or exercise plan in your response, you MUST also include the complete, updated plan for that day in a structured JSON format at the end of your response, enclosed in \`<<<PLAN_UPDATE>>>...\` tags.
      The JSON object MUST have the exact same structure as a single day object from the original plan generation. It must have these top-level keys: "day", "meals", "exercise", and "dailyTotals".
      - The "meals" key must be an OBJECT with "breakfast", "lunch", "dinner", and "snack" as its keys. Each of those must be an object with "name", "calories", "protein", "carbs", and "fat".
      - The "exercise" key must be an OBJECT with "activity", "duration", and "caloriesBurned".
      - The "dailyTotals" key must be an OBJECT with "totalCalories", "totalProtein", "totalCarbs", "totalFat".
      Do NOT use arrays for meals or exercise.
    `;

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
      systemInstruction: systemInstruction,
    });

    const existingHistory = conversation ? conversation.messages.map(msg => ({
      role: msg.role,
      parts: msg.parts.map(p => ({ text: p.text })),
    })) : [];

    const chat = model.startChat({
      history: existingHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const aiReply = response.text();

    const userMessage = { role: 'user', parts: [{ text: message }] };
    const modelMessage = { role: 'model', parts: [{ text: aiReply }] };

    if (conversation) {
      conversation.messages.push(userMessage, modelMessage);
      await conversation.save();
    } else {
      await ConversationHistory.create({
        user: userId,
        messages: [userMessage, modelMessage],
      });
    }

    res.json({ reply: aiReply });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ message: 'Failed to get a response from the AI coach.' });
  }
};

export { handleChatMessage };
