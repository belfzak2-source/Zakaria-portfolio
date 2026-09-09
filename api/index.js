const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Allows your server to read JSON data

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB! Sick!'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// 2. Define the Schema (Making sure everything uses Links/URLs)
const WorkSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String, // 'commission', 'game', 'ui', etc.
  thumbnailUrl: String, // You paste the link here in the admin panel
  videoUrl: String,     // You paste the video link here
  role: String,         // e.g., "Solo", "50% Scripter"
  createdAt: { type: Date, default: Date.now }
});

const WorkItem = mongoose.model('Work', WorkSchema);

// 3. Admin Authentication Middleware
// This checks if the user provided the correct password before letting them add data
const checkAdmin = (req, res, next) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    next(); // Password correct, proceed to save!
  } else {
    res.status(401).json({ error: 'Unauthorized. Wrong password bro.' });
  }
};

// 4. Routes

// GET route: Your main website will call this to load the commissions and games
app.get('/api/work', async (req, res) => {
  try {
    const items = await WorkItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch work items' });
  }
});

// POST route: Your Admin Panel will call this to save new stuff
// Notice it uses the 'checkAdmin' middleware first!
app.post('/api/work', checkAdmin, async (req, res) => {
  try {
    const { title, description, category, thumbnailUrl, videoUrl, role } = req.body;
    
    const newItem = new WorkItem({
      title,
      description,
      category,
      thumbnailUrl,
      videoUrl,
      role
    });

    await newItem.save();
    res.status(201).json({ message: 'Successfully added to portfolio!', item: newItem });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save item' });
  }
});

// 5. Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});