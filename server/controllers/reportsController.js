import DailyProgress from '../models/DailyProgress.js';
import WeightLog from '../models/WeightLog.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Generate a progress report
// @route   POST /api/reports/generate
const generateReport = async (req, res) => {
  const { period } = req.body; // e.g., "weekly" or "monthly"
  const userId = req.user._id;

  try {
    // 1. Define the date range for the report
    const endDate = new Date();
    const startDate = new Date();
    if (period === 'weekly') {
      startDate.setDate(endDate.getDate() - 7);
    } else if (period === 'monthly') {
      startDate.setMonth(endDate.getMonth() - 1);
    } else {
      return res.status(400).json({ message: 'Invalid period specified.' });
    }

    // 2. Fetch all relevant data for the period
    const [progressData, weightData] = await Promise.all([
      DailyProgress.find({ user: userId, date: { $gte: startDate, $lte: endDate } }),
      WeightLog.find({ user: userId, date: { $gte: startDate, $lte: endDate } }).sort({ date: 1 }),
    ]);

    // 3. Summarize the data into a text format for the AI
    let summary = `Here is the user's ${period} progress summary:\n`;
    summary += `- Total days tracked: ${progressData.length}\n`;
    summary += `- Days exercise completed: ${progressData.filter(p => p.completedExercise).length}\n`;

    if (weightData.length > 1) {
      const startWeight = weightData[0].weight;
      const endWeight = weightData[weightData.length - 1].weight;
      const weightChange = (endWeight - startWeight).toFixed(1);
      summary += `- Weight change: Started at ${startWeight} ${weightData[0].unit}, ended at ${endWeight} ${weightData[0].unit}. Change of ${weightChange} ${weightData[0].unit}.\n`;
    } else if (weightData.length === 1) {
      summary += `- Current weight: ${weightData[0].weight} ${weightData[0].unit}.\n`;
    }

    // 4. Construct the prompt for the AI
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const prompt = `
      You are Label-Wise, a friendly and motivational AI wellness coach.
      Analyze the following user progress summary and write an encouraging report.
      The report should be in markdown format.
      Start with a positive headline.
      Then, highlight what the user did well (their "wins").
      Next, gently suggest one or two areas for improvement.
      Finally, end with a motivational closing statement to keep them inspired for the next period.
      Keep the tone positive and supportive.

      Here is the data summary:
      ${summary}
    `;

    // 5. Call the AI and send the response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reportText = response.text();

    res.json({ report: reportText });

  } catch (error) {
    console.error('Report Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate report.' });
  }
};

export { generateReport };