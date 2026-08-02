import type { Request, Response, NextFunction } from 'express';
import * as documentsService from './documents.service.js';
import {
  createDocumentSchema,
  reviewDocumentSchema,
} from './documents.validation.js';

const sanitize = (doc: any) => ({
  id: doc.id,
  name: doc.name,
  level: doc.level,
  session: doc.session,
  unit: doc.unit,
  status: doc.status,
  rejectionReason: doc.rejectionReason,
  fileUrl: doc.filePath,
  fileSize: doc.fileSize,
  mimeType: doc.mimeType,
  student: {
    id: doc.student.id,
    name: doc.student.name,
    studentId: doc.student.studentId,
    department: doc.student.department?.name || '',
  },
  recipient: {
    id: doc.recipient.id,
    name: doc.recipient.name,
    role: doc.recipient.role,
    department: doc.recipient.department?.name || '',
  },
  reviewedBy: doc.reviewedBy
    ? { id: doc.reviewedBy.id, name: doc.reviewedBy.name }
    : null,
  reviewedAt: doc.reviewedAt,
  date: doc.createdAt.toISOString().split('T')[0],
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'File is required' });
    }
    const data = createDocumentSchema.parse(req.body);
    const studentId = (req.user as { id: string }).id;

    const file = {
      path: `/uploads/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype,
    };

    const document = await documentsService.create(studentId, data, file, req.ip);
    res.status(201).json({ status: 'success', data: sanitize(document) });
  } catch (err) {
    next(err);
  }
};

export const getMine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = (req.user as { id: string }).id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const status = req.query.status as string;

    const { documents, meta } = await documentsService.getMine(studentId, {
      page,
      limit,
      status,
    });
    res.json({ status: 'success', data: documents.map(sanitize), meta });
  } catch (err) {
    next(err);
  }
};

export const getInbox = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const recipientId = (req.user as { id: string }).id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const status = req.query.status as string;
    const search = req.query.search as string;

    const { documents, meta } = await documentsService.getInbox(recipientId, {
      page,
      limit,
      status,
      search,
    });
    res.json({ status: 'success', data: documents.map(sanitize), meta });
  } catch (err) {
    next(err);
  }
};

export const review = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = reviewDocumentSchema.parse(req.body);
    const reviewerId = (req.user as { id: string }).id;
    const document = await documentsService.review(
      req.params.id as string,
      data,
      reviewerId,
      req.ip,
    );
    res.json({ status: 'success', data: sanitize(document) });
  } catch (err) {
    next(err);
  }
};
