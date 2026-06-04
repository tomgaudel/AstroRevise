import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { query } from './database/connection.js';

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

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

// Routes d'authentification
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  try {
    const hashedPassword = await import('bcryptjs').then(bcrypt => bcrypt.hash(password, 10));
    const result = await query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    res.status(201).json({ user: result.rows[0], token: 'fake-token' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const user = result.rows[0];
    const bcrypt = await import('bcryptjs');
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const jwt = await import('jsonwebtoken');
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({ user: { id: user.id, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

// Route test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AstroRevise Backend running on port ${PORT}`);
});