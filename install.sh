#!/bin/bash

# AstroRevise Installation Script

echo "🚀 Installation d'AstroRevise..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ Node.js détecté: $(node --version)"

# Backend setup
echo ""
echo "📦 Installation du backend..."
cd backend
npm install
cp .env.example .env

echo ""
echo "⚠️  Veuillez configurer la base de données PostgreSQL dans backend/.env"
echo "   Exécutez ensuite le schéma SQL depuis backend/src/database/seed.sql"

cd ..

# Frontend setup
echo ""
echo "📦 Installation du frontend..."
cd frontend
npm install

cd ..

echo ""
echo "✅ Installation terminée!"
echo ""
echo "📖 Prochaines étapes:"
echo "1. Configure PostgreSQL et .env dans le dossier backend"
echo "2. Exécute les migrations SQL depuis backend/src/database/seed.sql"
echo "3. Lance le backend: cd backend && npm run dev"
echo "4. Lance le frontend: cd frontend && npm run dev"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "Bonne révision! 🎓"
