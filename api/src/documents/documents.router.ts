import { Router } from 'express';
import * as documentsController from './documents.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const documentsRouter = Router();

documentsRouter.use(authenticate);

documentsRouter.post(
  '/',
  authorize('student'),
  upload.single('file'),
  documentsController.create,
);
documentsRouter.get('/', authorize('student'), documentsController.getMine);
documentsRouter.get(
  '/inbox',
  authorize('academic', 'bursary', 'department'),
  documentsController.getInbox,
);
documentsRouter.get('/:id', documentsController.getById);
documentsRouter.patch(
  '/:id/review',
  authorize('academic', 'bursary', 'department'),
  documentsController.review,
);

export default documentsRouter;
