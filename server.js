import express from 'express';
import fs from 'fs';
import stopwatchRouter from './src/routes/stopwatch.js';
import timerRouter from './src/routes/timer.js';  // 追加
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use('/pages', express.static('public/pages'));
app.use('/css', express.static(join(__dirname, 'public/css')));
app.use('/js', express.static(join(__dirname, 'public/js')));
app.use('/pages', express.static(join(__dirname, 'public/pages')));
app.use('/shared', express.static(join(__dirname, 'src/shared')));
app.use('/api/stopwatch', stopwatchRouter);
app.use('/api/timer', timerRouter);  // 追加
app.use(express.json());

// Settings endpoints
app.get('/api/settings', (req, res) => {
  try {
    const settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
    res.json(settings);
  } catch (error) {
    res.json({ showAHTime: true, showActualTime: true });
  }
});

app.post('/api/settings', (req, res) => {
  try {
    fs.writeFileSync('settings.json', JSON.stringify(req.body));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running → http://0.0.0.0:${port}`);
});