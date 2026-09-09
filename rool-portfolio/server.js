require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 2. Define Database Blueprints (Schemas)
const WorkItem = mongoose.model('WorkItem', new mongoose.Schema({
  title: String, category: String, role: String,
  thumbnailUrl: String, videoUrl: String, gameLink: String,
  description: String, createdAt: { type: Date, default: Date.now }
}));

const GlobalData = mongoose.model('GlobalData', new mongoose.Schema({
  views: { type: Number, default: 0 },
  stats: { gamesMade: String, visitCount: String, experienceYears: String },
  payment: { paypal: String, robux: String, bank: String }
}));

// Helper to get or create global settings
async function getGlobalData() {
  let data = await GlobalData.findOne();
  if (!data) {
    data = await GlobalData.create({
      views: 0,
      stats: { gamesMade: '0', visitCount: '0', experienceYears: '0' },
      payment: { paypal: '', robux: '', bank: '' }
    });
  }
  return data;
}

// --- API ENDPOINTS ---

app.get('/api/stats', async (req, res) => {
  const data = await getGlobalData();
  res.json(data.stats);
});

app.post('/api/stats', async (req, res) => {
  const { password, gamesMade, visitCount, experienceYears } = req.body;
  if (password !== 'zak56belf') return res.status(401).json({ error: 'Unauthorized' });
  const data = await getGlobalData();
  data.stats = { gamesMade, visitCount, experienceYears };
  await data.save();
  res.json({ ok: true, stats: data.stats });
});

app.get('/api/work', async (req, res) => {
  const items = await WorkItem.find().sort({ createdAt: -1 }); // Newest first
  res.json(items);
});

app.post('/api/work', async (req, res) => {
  const { password, title, category, role, thumbnailUrl, videoUrl, gameLink, description } = req.body;
  if (password !== 'zak56belf') return res.status(401).json({ error: 'Unauthorized' });
  const newItem = await WorkItem.create({ title, category, role, thumbnailUrl, videoUrl, gameLink, description });
  res.json({ ok: true, item: newItem });
});

app.delete('/api/work/:id', async (req, res) => {
  const { password } = req.body;
  if (password !== 'zak56belf') return res.status(401).json({ error: 'Unauthorized' });
  await WorkItem.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

app.get('/api/payment', async (req, res) => {
  const data = await getGlobalData();
  res.json(data.payment);
});

app.post('/api/payment', async (req, res) => {
  const { password, paypal, robux, bank } = req.body;
  if (password !== 'zak56belf') return res.status(401).json({ error: 'Unauthorized' });
  const data = await getGlobalData();
  data.payment = { paypal, robux, bank };
  await data.save();
  res.json({ ok: true });
});

// Get current views without incrementing
app.get('/api/views', async (req, res) => {
  const data = await getGlobalData();
  res.json({ views: data.views });
});

// Increment views by 1
app.post('/api/views', async (req, res) => {
  const data = await getGlobalData();
  data.views += 1;
  await data.save();
  res.json({ views: data.views });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
