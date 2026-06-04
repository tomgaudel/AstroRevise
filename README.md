# AstroRevise - Revision Planning App

Une application web complète pour aider les lycéens à organiser leurs révisions, suivre leur progression et réussir brillamment.

## 🎯 Fonctionnalités principales

- **📚 Gestion des chapitres** : Organisez vos études par matière, thème et chapitre
- **📝 Prise de notes** : Éditeur de texte riche avec support Markdown
- **📅 Planification** : Calendrier interactif et todo list pour vos révisions
- **❓ QCM pratiques** : Créez et passez des tests pour mesurer votre maîtrise
- **🧠 Intégration Anki** : Synchronisez vos flashcards avec AnkiConnect
- **📊 Tableau de bord** : Suivez votre progression en temps réel
- **📱 Responsive** : Fonctionne sur PC et mobile
- **☁️ Synchronisation** : Accédez vos données depuis n'importe où

## 🛠️ Stack technique

### Frontend
- **React 18** avec Vite
- **TypeScript** pour la typage
- **TailwindCSS** pour le design
- **Zustand** pour l'état global
- **TipTap** pour l'éditeur riche
- **date-fns** pour les dates
- **React Router** pour la navigation

### Backend
- **Node.js + Express** 
- **TypeScript**
- **PostgreSQL** pour la base de données
- **JWT** pour l'authentification
- **AnkiConnect** pour l'intégration Anki

## 📋 Prérequis

- Node.js >= 18
- npm ou yarn
- PostgreSQL >= 12
- (Optionnel) Anki avec AnkiConnect pour la synchronisation

## 🚀 Installation et lancement

### 1. Clone le projet

\`\`\`bash
git clone <your-repo-url>
cd SITE\ REVISION
\`\`\`

### 2. Setup Backend

\`\`\`bash
cd backend

# Installe les dépendances
npm install

# Configure les variables d'environnement
cp .env.example .env
# Édite .env avec ta configuration PostgreSQL

# Crée la base de données et les tables
# Exécute le contenu de src/database/seed.sql dans PostgreSQL

# Lance le serveur de développement
npm run dev
\`\`\`

Le backend sera disponible sur `http://localhost:5000`

### 3. Setup Frontend

\`\`\`bash
cd ../frontend

# Installe les dépendances
npm install

# Lance le serveur de développement
npm run dev
\`\`\`

Le frontend sera disponible sur `http://localhost:5173`

## 🔑 Variables d'environnement

### Backend (.env)
\`\`\`
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/astrorevise
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRY=7d
FRONTEND_URL=http://localhost:5173
\`\`\`

### Frontend (.env)
\`\`\`
# La communication API se fait via proxy Vite
# Pas de variable d'env requise pour le développement
\`\`\`

## 🗄️ Structure de la base de données

La base de données contient les tables suivantes :
- `users` - Utilisateurs
- `matters` - Matières (Maths, Physique)
- `themes` - Thèmes (Analyse, Algèbre, etc.)
- `chapters` - Chapitres
- `notes` - Notes de cours
- `questions` - Questions de QCM
- `qcm_scores` - Scores des QCM
- `tasks` - Tâches de révision
- `file_resources` - Fichiers (PDFs, images)
- `videos` - Vidéos YouTube
- `anki_cards` - Flashcards Anki
- `anki_deck_configs` - Configuration des decks Anki

## 🔗 Intégration AnkiConnect

Pour utiliser l'intégration Anki :

1. Installe Anki sur ton ordinateur
2. Installe l'extension **AnkiConnect** (https://ankiweb.net/shared/info/2055492159)
3. Redémarre Anki
4. L'application détectera automatiquement la connexion

**Note** : AnkiConnect écoute sur `http://localhost:8765`. Si tu changes le port, modifie-le dans `backend/src/services/ankiService.ts`.

## 📦 Build pour la production

### Frontend
\`\`\`bash
cd frontend
npm run build
# Les fichiers générés sont dans dist/
\`\`\`

### Backend
\`\`\`bash
cd backend
npm run build
# Lance avec: npm start
\`\`\`

## 🚀 Déploiement

### Frontend (Vercel)
\`\`\`bash
# Via Vercel CLI
npm i -g vercel
vercel
\`\`\`

### Backend + DB (Render)
1. Pousse ton code sur GitHub
2. Crée un nouveau service sur Render.com
3. Configure les variables d'environnement
4. Relie le dépôt GitHub
5. Render déploiera automatiquement

## 📖 Documentation API

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur

### Chapitres
- `GET /api/chapters/matters` - Récupère les matières
- `GET /api/chapters/themes` - Récupère les thèmes
- `GET /api/chapters/chapters` - Récupère les chapitres
- `POST /api/chapters/chapters` - Crée un chapitre
- `PUT /api/chapters/chapters/:id` - Modifie un chapitre
- `DELETE /api/chapters/chapters/:id` - Supprime un chapitre

### Notes
- `GET /api/notes/:chapterId` - Récupère les notes d'un chapitre
- `POST /api/notes` - Crée une note
- `PUT /api/notes/:id` - Modifie une note
- `DELETE /api/notes/:id` - Supprime une note

### QCM
- `GET /api/qcm/:chapterId` - Récupère les questions
- `POST /api/qcm` - Crée une question
- `POST /api/qcm/start` - Démarre un QCM
- `POST /api/qcm/submit` - Soumet les réponses

### Tâches
- `GET /api/tasks` - Récupère les tâches
- `POST /api/tasks` - Crée une tâche
- `PUT /api/tasks/:id` - Modifie une tâche
- `DELETE /api/tasks/:id` - Supprime une tâche

### Ressources & Anki
- `POST /api/resources/files` - Ajoute un fichier
- `POST /api/resources/videos` - Ajoute une vidéo
- `POST /api/resources/anki/cards` - Crée une carte Anki
- `GET /api/resources/anki/check` - Vérifie la connexion Anki
- `GET /api/resources/export/data` - Exporte les données utilisateur

## 🎨 Thème de design

- **Couleur primaire** : Violet néon (#C026D3 / #BF00FF)
- **Palette** : Dégradés doux, ombres légères, étoiles discrètes
- **Police** : Inter
- **Responsive** : Mobile-first avec breakpoints Tailwind standards

## 🐛 Troubleshooting

### Erreur de connexion PostgreSQL
- Vérifie que PostgreSQL est lancé
- Vérifie la `DATABASE_URL` dans `.env`
- Vérifie que la base de données existe

### Anki non détecté
- Vérifie qu'Anki est lancé
- Vérifie que AnkiConnect est installé et activé
- Redémarre Anki
- Vérifie que le port 8765 est accessible

### Problèmes CORS
- Vérifie que `FRONTEND_URL` dans `.env` backend correspond à ton URL frontend
- En développement, utilise `http://localhost:5173`

## 📄 Licence

Ce projet est fourni à titre éducatif.

## 👨‍💻 Support

Pour toute question ou problème, merci de créer une issue sur le dépôt GitHub.

---

**AstroRevise** - Révisez intelligemment, réussissez brillamment ! 🚀
