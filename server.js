
import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

app.listen(PORT, () =>
  console.log(`Server running → http://0.0.0.0:${PORT}`)
);
