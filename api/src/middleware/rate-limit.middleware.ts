import rateLimit from 'express-rate-limit';

const handler = (_req: any, res: any) => {
  res.status(429).json({
    status: 'error',
    message: 'Too many requests, please try again later',
  });
};

const handlerLogin = (_req: any, res: any) => {
  res.status(429).json({
    status: 'error',
    message: 'Too many requests, please try again in 15 minutes',
  });
};

// export const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   limit: 5,
//   standardHeaders: true,
//   legacyHeaders: false,
//   handler: handlerLogin,
// });

export const createUserLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

export const createReportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 7,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

export const uploadDocumentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});
