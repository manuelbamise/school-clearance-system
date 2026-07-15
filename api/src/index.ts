import express from 'express';
import mainRouter from './main.router.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api', mainRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
