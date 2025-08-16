import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true, // Each user can only have one profile
  },
  goal: {
    type: String,
    required: [true, 'Please select a goal'],
    enum: ['Weight Loss', 'Muscle Gain', 'Maintain Health'],
  },
  diet: {
    type: String,
    required: [true, 'Please select a dietary preference'],
    enum: ['No Restrictions', 'Vegetarian', 'Vegan'],
  },
  activityLevel: {
    type: String,
    required: [true, 'Please select an activity level'],
    enum: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'],
  },
  healthNotes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;