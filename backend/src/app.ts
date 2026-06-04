import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Route login avec logs systématiques
app.post('/api/auth/login', (req, res) => {
  console.log('🔵 LOGIN REÇU !');
  console.log('Body reçu:', req.body);

  const { email, password } = req.body;
  if (!email || !password) {
    console.log('🔴 Email ou mot de passe manquant');
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  // Réponse temporaire pour tester
  console.log('🟢 Login accepté pour test');
  res.json({ message: 'Fake login OK' });
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