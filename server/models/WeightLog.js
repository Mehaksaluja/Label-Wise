import mongoose from 'mongoose';

const weightLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  weight: {
    type: Number,
    required: [true, 'Please enter your weight'],
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'lbs'],
    default: 'kg',
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const WeightLog = mongoose.model('WeightLog', weightLogSchema);

export default WeightLog;
