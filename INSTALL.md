# Guide d'installation détaillé pour AstroRevise

## 🎯 Objectif

Ce guide vous permettra de mettre en place et lancer AstroRevise en local pour le développement.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

### Obligatoire
- **Node.js >= 18** : [Télécharger](https://nodejs.org/)
- **npm >= 9** (installé avec Node.js)
- **PostgreSQL >= 12** : [Télécharger](https://www.postgresql.org/download/)
- **Git** : [Télécharger](https://git-scm.com/download)

### Optionnel (pour l'intégration Anki)
- **Anki** : [Télécharger](https://apps.ankiweb.net/)
- **AnkiConnect** : Extension Anki ([Installation](https://ankiweb.net/shared/info/2055492159))

## 🚀 Installation pas à pas

### Étape 1 : Vérifier les prérequis

```bash
# Vérifier Node.js et npm
node --version  # Devrait être >= 18.0.0
npm --version   # Devrait être >= 9.0.0

# Vérifier PostgreSQL
psql --version  # Devrait être >= 12

# Vérifier Git
git --version
```

### Étape 2 : Cloner/Préparer le projet

```bash
cd "C:\Users\Eleve\Desktop\SITE REVISION"
git init  # Si ce n'est pas déjà un repo Git
```

### Étape 3 : Configuration de PostgreSQL

#### 3.1 Créer l'utilisateur et la base de données

Ouvrez PostgreSQL (psql) :

```bash
psql -U postgres
```

Puis exécutez :

```sql
-- Créer l'utilisateur
CREATE USER postgres WITH PASSWORD 'your_secure_password';

-- Créer la base de données
CREATE DATABASE astrorevise OWNER postgres;

-- Accorder les permissions
GRANT ALL PRIVILEGES ON DATABASE astrorevise TO postgres;

-- Se connecter à la nouvelle base
\c astrorevise

-- Activer uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Quitter psql
\q
```

#### 3.2 Importer le schéma

```bash
# Via la ligne de commande (remplacez les identifiants)
psql -U postgres -d astrorevise < backend/src/database/seed.sql

# Vérifier que les tables sont créées
psql -U postgres -d astrorevise -c "\dt"
```

### Étape 4 : Configuration du Backend

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env

# Éditer .env avec vos paramètres
# Ouvrir backend/.env dans votre éditeur et configurer :
```

Contenu du fichier `backend/.env` :

```env
PORT=5000
NODE_ENV=development

# Format: postgresql://username:password@host:port/database
DATABASE_URL=postgresql://postgres:your_secure_password@localhost:5432/astrorevise

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800

FRONTEND_URL=http://localhost:5173
```

**⚠️ Important** : Générez une clé JWT sécurisée :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copiez la sortie dans `JWT_SECRET`.

### Étape 5 : Configuration du Frontend

```bash
# Revenir à la racine
cd ..

# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# En développement, aucune variable d'env n'est requise
# (Vite proxy les requêtes /api vers http://localhost:5000)
```

### Étape 6 : Test de la base de données

```bash
# Depuis la racine du projet
cd backend

# Tester la connexion (optionnel)
npm run typecheck

# Cela devrait compiler sans erreurs
```

## 🎮 Lancer l'application

### Option 1 : Lancer les services séparément

**Terminal 1 - Backend** :
```bash
cd backend
npm run dev
# L'output devrait afficher: 🚀 AstroRevise Backend running on port 5000
```

**Terminal 2 - Frontend** :
```bash
cd frontend
npm run dev
# L'output devrait afficher: VITE v5.0.8 ready in XXX ms
# ➜  Local:   http://localhost:5173/
```

### Option 2 : Script d'automatisation (Linux/Mac)

```bash
chmod +x dev.sh
./dev.sh
```

## ✅ Vérifier que tout fonctionne

### 1. Vérifier le backend

```bash
# Dans un nouveau terminal
curl http://localhost:5000/health

# Devrait retourner: {"status":"ok"}
```

### 2. Ouvrir le frontend

Ouvrir votre navigateur et aller à : **http://localhost:5173**

Vous devriez voir la page d'inscription.

### 3. Tester l'authentification

1. Cliquer sur "S'inscrire"
2. Entrer un email et un mot de passe
3. Cliquer sur "S'inscrire"
4. Vous devriez être redirigé vers la page de connexion
5. Vous connecter avec vos credentials
6. Vous devriez voir le tableau de bord

### 4. (Optionnel) Vérifier AnkiConnect

```bash
# Si Anki + AnkiConnect est lancé
curl -X POST http://localhost:8765 \
  -H "Content-Type: application/json" \
  -d '{"action":"version","version":6}'

# Devrait retourner: {"result":6,"error":null}
```

## 🔧 Dépannage courant

### Erreur : "database "astrorevise" does not exist"

**Solution** : Vous n'avez pas créé la base de données. Relancez l'étape 3.

### Erreur : "password authentication failed"

**Solution** : Vérifiez que :
- L'utilisateur a été créé avec le bon mot de passe
- Le `DATABASE_URL` dans `.env` est correct
- Le format est : `postgresql://username:password@localhost:5432/database`

### Le frontend ne peut pas accéder au backend

**Solution** : Vérifiez que :
- Le backend est lancé (`npm run dev` dans le dossier backend)
- Le port 5000 n'est pas utilisé par une autre application
- La variable `FRONTEND_URL` dans le backend `.env` est correcte

### "Module not found" errors

**Solution** : Réinstallez les dépendances :
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Les styles Tailwind ne s'appliquent pas

**Solution** : Vérifiez que le serveur frontend Vite est relancé et que le fichier `frontend/src/styles/globals.css` est importé dans `App.tsx`.

## 📚 Structure des dossiers créée

Après l'installation, votre structure devrait ressembler à :

```
SITE REVISION/
├── backend/
│   ├── src/
│   ├── node_modules/
│   ├── .env (⚠️ Ne pas commiter)
│   ├── package.json
│   └── dist/ (créé après npm run build)
│
├── frontend/
│   ├── src/
│   ├── node_modules/
│   ├── dist/ (créé après npm run build)
│   └── package.json
│
├── database/
├── README.md
├── ARCHITECTURE.md
├── DEPLOYMENT.md
├── INSTALL.md (ce fichier)
└── .gitignore
```

## 🔄 Workflows courants

### Ajouter une dépendance

```bash
# Backend
cd backend
npm install nom_du_package
npm install --save-dev nom_du_package_dev

# Frontend
cd ../frontend
npm install nom_du_package
npm install --save-dev nom_du_package_dev
```

### Lancer les tests

```bash
# Backend
cd backend
npm run lint
npm run typecheck

# Frontend
cd frontend
npm run lint
npm run typecheck
```

### Compiler pour la production

```bash
# Backend
cd backend
npm run build
node dist/app.js

# Frontend
cd frontend
npm run build
# Les fichiers sont dans dist/
```

## 🚀 Prochaines étapes

1. ✅ Installation terminée
2. 📖 Consultez [ARCHITECTURE.md](./ARCHITECTURE.md) pour comprendre la structure
3. 🌐 Consultez [DEPLOYMENT.md](./DEPLOYMENT.md) pour déployer en production
4. 💻 Commencez à développer !

## 📞 Besoin d'aide ?

- Consultez les README dans les dossiers `backend/` et `frontend/`
- Vérifiez la section "Troubleshooting" du README principal
- Consultez les logs de chaque service pour les erreurs détaillées

---

**Bonne révision avec AstroRevise ! 🎓**

Dernière mise à jour : Juin 2026
