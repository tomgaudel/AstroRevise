import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/authRoutes.js';
import chapterRoutes from './routes/chapterRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import qcmRoutes from './routes/qcmRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import { errorHandler } from './middleware/auth.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/qcm', qcmRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/resources', resourceRoutes);

// Error handling
app.use(errorHandler);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 AstroRevise Backend running on port ${PORT}`);
});

export default app;
