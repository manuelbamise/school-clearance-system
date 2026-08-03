import express from 'express';
import cors from 'cors';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';
import mainRouter from './main.router.js';
import swaggerSpec from './swagger.js';
import './auth/passport.js';
import { errorHandler } from './middleware/error.middleware.js';
import { uploadsDirPath } from './middleware/upload.middleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
app.use(express.json());
app.use(passport.initialize());
app.use('/uploads', express.static(uploadsDirPath));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', mainRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
