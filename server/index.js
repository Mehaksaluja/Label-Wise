import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js'; // Add .js
import analysisRoutes from './routes/analysisRoutes.js'; // Add .js
import userRoutes from './routes/userRoutes.js'; // Add .js

// Connect to the database
connectDB();

const app = express();

// --- Middleware ---
// Enable CORS for all routes
app.use(cors());
// This allows our server to understand incoming JSON data
app.use(express.json());

const PORT = process.env.PORT || 5001;

// --- Routes ---
app.get('/api', (req, res) => {
  res.json({ message: "Hello from the Label-Wise server! 👋" });
});

// Use the analysis routes for any path starting with /api
app.use('/api', analysisRoutes);
app.use('/api/users', userRoutes); // 2. Add the user routes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});