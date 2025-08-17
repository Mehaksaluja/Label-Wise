import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['user', 'model'], // 'user' for messages from the human, 'model' for responses from the AI
  },
  parts: {
    type: [{ text: String }], // The text content of the message, structured for the AI
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const conversationHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true, // Each user has one continuous conversation history
  },
  messages: [messageSchema], // An array to store the back-and-forth conversation
}, {
  timestamps: true,
});

const ConversationHistory = mongoose.model('ConversationHistory', conversationHistorySchema);

export default ConversationHistory;