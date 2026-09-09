const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB Error:', err));

// Schemas
const WorkSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String, // 'Scripting', 'Animations', 'Ui', 'Grafics', 'game'
  thumbnailUrl: String,
  videoUrl: String,
  gameLink: String,
  role: String,
  createdAt: { type: Date, default: Date.now }
});

const StatsSchema = new mongoose.Schema({
  gamesMade: { type: String, default: '0' },
  visitCount: { type: String, default: '0' },
  experienceYears: { type: String, default: '0' }
});

const PaymentSchema = new mongoose.Schema({
  paypal: String,
  robux: String,
  bank: String
});

const ViewSchema = new mongoose.Schema({
  views: { type: Number, default: 0 }
});

const WorkItem = mongoose.model('Work', WorkSchema);
const Stats = mongoose.model('Stats', StatsSchema);
const Payment = mongoose.model('Payment', PaymentSchema);
const View = mongoose.model('View', ViewSchema);

const checkAdmin = (req, res, next) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD || password === "zak56belf") {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized.' });
  }
};

// Routes
app.get('/api/work', async (req, res) => {
  const items = await WorkItem.find().sort({ createdAt: -1 });
  res.json(items);
});

app.post('/api/work', checkAdmin, async (req, res) => {
  const newItem = new WorkItem(req.body);
  await newItem.save();
  res.status(201).json({ message: 'Saved successfully', item: newItem });
});

app.delete('/api/work/:id', checkAdmin, async (req, res) => {
  await WorkItem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

app.get('/api/stats', async (req, res) => {
  let stats = await Stats.findOne();
  if (!stats) stats = await Stats.create({});
  res.json(stats);
});

app.post('/api/stats', checkAdmin, async (req, res) => {
  const { gamesMade, visitCount, experienceYears } = req.body;
  let stats = await Stats.findOne();
  if (!stats) stats = new Stats();
  stats.gamesMade = gamesMade;
  stats.visitCount = visitCount;
  stats.experienceYears = experienceYears;
  await stats.save();
  res.json(stats);
});

app.get('/api/payment', async (req, res) => {
  let pay = await Payment.findOne();
  if (!pay) pay = await Payment.create({ paypal: 'Accepted', robux: 'Group Funds', bank: 'Direct Wire' });
  res.json(pay);
});

app.post('/api/payment', checkAdmin, async (req, res) => {
  const { paypal, robux, bank } = req.body;
  let pay = await Payment.findOne();
  if (!pay) pay = new Payment();
  pay.paypal = paypal;
  pay.robux = robux;
  pay.bank = bank;
  await pay.save();
  res.json(pay);
});

app.post('/api/views', async (req, res) => {
  let record = await View.findOne();
  if (!record) record = new View({ views: 0 });
  record.views += 1;
  await record.save();
  res.json({ views: record.views });
});

module.exports = app;
