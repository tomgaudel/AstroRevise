import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './database/connection.js';

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes d'authentification
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    const token = jwt.sign(
      { userId: result.rows[0].id, email: result.rows[0].email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    res.status(201).json({ user: result.rows[0], token });
  } catch (err: any) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'Email déjà utilisé' });
    } else {
      res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
  }
});

app.post('/api/auth/login', async (req, res) => {
  console.log('🔵 Requête login reçue');
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
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({ user: { id: user.id, email: user.email }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});