import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true, // Each user gets one master plan
  },
  // We use a generic Object type to store the complex JSON plan from the AI
  planData: {
    type: Object,
    required: true,
  },
}, {
  timestamps: true,
});

const Plan = mongoose.model('Plan', planSchema);

export default Plan;