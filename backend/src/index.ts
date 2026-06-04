import 'dotenv/config';
import express from 'express';

const app = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

app.get('/', (req, res) => {
  res.json({ message: 'AstroRevise API is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});