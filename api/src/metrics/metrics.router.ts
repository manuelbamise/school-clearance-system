import { Router } from 'express';
import * as metricsController from './metrics.controller.js';
import { authenticateVerified } from '../middleware/auth.middleware.js';

const metricsRouter = Router();

metricsRouter.get('/', authenticateVerified, metricsController.getMetrics);

export default metricsRouter;
