import Profile from '../models/Profile.js';

// @desc    Get user profile
// @route   GET /api/profile
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create or update user profile
// @route   POST /api/profile
const createOrUpdateProfile = async (req, res) => {
  const { goal, diet, activityLevel, healthNotes } = req.body;
  const profileFields = {
    user: req.user._id,
    goal,
    diet,
    activityLevel,
    healthNotes,
  };

  try {
    let profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profileFields },
      { new: true, upsert: true } // 'new' returns the updated doc, 'upsert' creates it if it doesn't exist
    );
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

export { getProfile, createOrUpdateProfile };