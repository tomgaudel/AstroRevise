import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Route test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Route login temporaire (pour tester)
app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Login route hit' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AstroRevise Backend running on port ${PORT}`);
});