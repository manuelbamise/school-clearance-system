import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/health', (_req, res) => {
  res.json({ status: 'success', message: 'Server is running well' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
