import { Router } from 'express';
import * as metricsController from './metrics.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const metricsRouter = Router();

metricsRouter.get('/', authenticate, metricsController.getMetrics);

export default metricsRouter;
