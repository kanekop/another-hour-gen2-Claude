
import express from "express";
import fs from "fs";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

// Settings endpoints
app.get('/api/settings', (req, res) => {
  const settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
  res.json(settings);
});

app.post('/api/settings', (req, res) => {
  fs.writeFileSync('settings.json', JSON.stringify(req.body));
  res.json({ success: true });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

app.get('/admin', (req, res) => {
  res.sendFile('admin.html', { root: './public' });
});

app.listen(PORT, () =>
  console.log(`Server running → http://0.0.0.0:${PORT}`)
);
