import mongoose from 'mongoose';

const dailyProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  date: {
    type: Date,
    required: true,
  },
  // We will store the IDs of the completed tasks
  completedMeals: {
    type: [String], // e.g., ['breakfast', 'lunch']
    default: [],
  },
  completedExercise: {
    type: Boolean,
    default: false,
  },
  // This ensures a user can only have one entry per day
  uniqueDateForUser: {
    type: String,
    unique: true,
  },
}, {
  timestamps: true,
});

// This pre-save hook creates a unique index to prevent duplicate entries for the same user on the same day
dailyProgressSchema.pre('save', function (next) {
  const date = new Date(this.date);
  // Normalize the date to the start of the day in UTC
  const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  this.uniqueDateForUser = `${this.user.toString()}-${startOfDay.toISOString()}`;
  next();
});

const DailyProgress = mongoose.model('DailyProgress', dailyProgressSchema);

export default DailyProgress;

