import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

// Serverless MongoDB Connection (Prevents crashing on Vercel)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
};

// Ensure DB is connected before handling any request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// --- Database Models ---
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
  const items = await WorkItem.find().sort({ createdAt: -1 }); 
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

app.get('/api/views', async (req, res) => {
  const data = await getGlobalData();
  res.json({ views: data.views });
});

app.post('/api/views', async (req, res) => {
  const data = await getGlobalData();
  data.views += 1;
  await data.save();
  res.json({ views: data.views });
});

// MUST EXPORT APP FOR VERCEL
export default app;
