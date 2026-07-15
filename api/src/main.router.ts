import { Router } from 'express';

const mainRouter = Router();

mainRouter.get('/health', (_req, res) => {
  res.json({ status: 'success', message: 'Server is running well' });
});

export default mainRouter;
