import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.post('/api/auth/login', (req, res) => {
  console.log('🔵 Requête login reçue');
  console.log('Body:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }
  
  // Pour l'instant, on accepte n'importe quel email/password
  // pour tester que la route fonctionne
  res.json({ 
    user: { email, id: '123' }, 
    token: 'fake-token-for-testing' 
  });
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