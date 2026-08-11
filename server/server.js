const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: ['https://laurenceH-coder.github.io', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// 1. Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch(err => console.error('MongoDB connection error:', err));

// 2. Define the Schema (Username is Primary Key)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  movies: { type: Array, default: [] }
});

const User = mongoose.model('User', userSchema);

// --- API ENDPOINTS ---

// Get movies for a specific user
app.get('/api/users/:username/movies', async (req, res) => {
  try {
    let user = await User.findOne({ username: req.params.username });
    if (!user) {
      // Create user document automatically if they don't exist yet
      user = await User.create({ username: req.params.username, movies: [] });
    }
    res.json(user.movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update the entire movies array for a user
app.put('/api/users/:username/movies', async (req, res) => {
  try {
    const { movies } = req.body;
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { movies },
      { new: true, upsert: true }
    );
    res.json(user.movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});