import DailyProgress from '../models/DailyProgress.js';
import WeightLog from '../models/WeightLog.js';

// A helper function to get the start of the day in UTC
const getStartOfDayUTC = (date) => {
  const d = new Date(date);
  // The fix is here: getUTCMonth() instead of getUTCFullMonth()
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

// @desc    Log or update daily progress
// @route   POST /api/progress/log
const logOrUpdateProgress = async (req, res) => {
  const { date, completedMeal, completedExercise } = req.body; // e.g., completedMeal: "breakfast"
  const today = getStartOfDayUTC(date || new Date());

  try {
    let progress = await DailyProgress.findOne({
      user: req.user._id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });

    if (!progress) {
      progress = new DailyProgress({ user: req.user._id, date: today });
    }

    if (completedMeal && !progress.completedMeals.includes(completedMeal)) {
      progress.completedMeals.push(completedMeal);
    }
    if (completedExercise !== undefined) {
      progress.completedExercise = completedExercise;
    }

    const updatedProgress = await progress.save();
    res.status(201).json(updatedProgress);
  } catch (error) {
    res.status(500).json({ message: 'Server error while logging progress.' });
  }
};

// @desc    Log a new weight entry
// @route   POST /api/progress/weight
const logWeight = async (req, res) => {
  const { weight, unit } = req.body;
  if (!weight) {
    return res.status(400).json({ message: 'Weight is required.' });
  }
  try {
    const newWeightLog = new WeightLog({
      user: req.user._id,
      weight,
      unit,
    });
    const savedLog = await newWeightLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(500).json({ message: 'Server error while logging weight.' });
  }
};

// @desc    Get all dashboard data (progress and weight)
// @route   GET /api/progress/dashboard
const getDashboardData = async (req, res) => {
  try {
    const progressData = await DailyProgress.find({ user: req.user._id }).sort({ date: -1 });
    const weightData = await WeightLog.find({ user: req.user._id }).sort({ date: -1 });

    res.json({
      progress: progressData,
      weight: weightData,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching dashboard data.' });
  }
};

export { logOrUpdateProgress, logWeight, getDashboardData };