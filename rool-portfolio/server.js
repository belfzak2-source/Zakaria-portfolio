const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');

// Helper function to read data from data.json
function loadDataFromFile() {
  if (!fs.existsSync(DATA_FILE)) {
    const defaultData = {
      views: 0,
      stats: { gamesMade: '0', visitCount: '0', experienceYears: '0' },
      work: [],
      payment: { paypal: '', robux: '', bank: '' }
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error('Error reading JSON file, returning empty state:', err);
    return { views: 0, stats: {}, work: [], payment: {} };
  }
}

// Helper function to save updated data back to data.json
function saveDataToFile(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// --- API ENDPOINTS ---

// GET Stats
app.get('/api/stats', (req, res) => {
  const db = loadDataFromFile();
  res.json(db.stats);
});

// POST Stats
app.post('/api/stats', (req, res) => {
  const { password, gamesMade, visitCount, experienceYears } = req.body;
  if (password !== 'zak56belf') return res.status(401).json({ error: 'Unauthorized' });

  const db = loadDataFromFile();
  db.stats = { gamesMade, visitCount, experienceYears };
  saveDataToFile(db);

  res.json({ ok: true, stats: db.stats });
});

// GET Work items
app.get('/api/work', (req, res) => {
  const db = loadDataFromFile();
  res.json(db.work);
});

// POST Work item
app.post('/api/work', (req, res) => {
  const { password, title, category, role, thumbnailUrl, videoUrl, gameLink, description } = req.body;
  if (password !== 'zak56belf') return res.status(401).json({ error: 'Unauthorized' });

  const db = loadDataFromFile();
  const newItem = {
    _id: Date.now().toString(),
    title, category, role, thumbnailUrl, videoUrl, gameLink, description
  };

  db.work.unshift(newItem); // Add new item to top
  saveDataToFile(db);

  res.json({ ok: true, item: newItem });
});

// DELETE Work item
app.delete('/api/work/:id', (req, res) => {
  const { password } = req.body;
  if (password !== 'zak56belf') return res.status(401).json({ error: 'Unauthorized' });

  const db = loadDataFromFile();
  db.work = db.work.filter(item => item._id !== req.params.id);
  saveDataToFile(db);

  res.json({ ok: true });
});

// GET Payment details
app.get('/api/payment', (req, res) => {
  const db = loadDataFromFile();
  res.json(db.payment);
});

// POST Payment details
app.post('/api/payment', (req, res) => {
  const { password, paypal, robux, bank } = req.body;
  if (password !== 'zak56belf') return res.status(401).json({ error: 'Unauthorized' });

  const db = loadDataFromFile();
  db.payment = { paypal, robux, bank };
  saveDataToFile(db);

  res.json({ ok: true });
});

// Increment views
app.post('/api/views', (req, res) => {
  const db = loadDataFromFile();
  db.views = (db.views || 0) + 1;
  saveDataToFile(db);
  res.json({ views: db.views });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
