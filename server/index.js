const express = require('express');
const cors = require('cors'); // Import cors
const connectDB = require('./config/db');
const analysisRoutes = require('./routes/analysisRoutes'); // Import our routes

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});