# Guide de configuration pour le déploiement

## Prérequis

- Compte Vercel (pour le frontend)
- Compte Render (pour le backend et la base de données)
- Accès à GitHub

## Étape 1 : Préparation du projet

### 1.1 Initialiser Git (si ce n'est pas déjà fait)

```bash
git init
git add .
git commit -m "Initial commit: AstroRevise"
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Étape 2 : Déployer la base de données sur Render

### 2.1 Créer une base de données PostgreSQL

1. Aller sur [render.com](https://render.com)
2. Cliquer sur "New +" → "PostgreSQL"
3. Remplir les détails :
   - **Name** : astrorevise-db
   - **Database** : astrorevise
   - **User** : postgres
   - **Region** : Choisir la région la plus proche
   - **PostgreSQL Version** : 15

4. Cliquer sur "Create Database"
5. Attendre que la base de données soit créée (quelques minutes)
6. Noter l'**External Database URL** (format: `postgresql://...`)

### 2.2 Importer le schéma

1. Depuis le dashboard Render, aller dans la section "Connect"
2. Utiliser l'URL fournie pour se connecter avec un client PostgreSQL (psql, DBeaver, etc.)
3. Exécuter le contenu du fichier `backend/src/database/seed.sql`

```bash
# Via ligne de commande
psql <DATABASE_URL> < backend/src/database/seed.sql
```

## Étape 3 : Déployer le Backend sur Render

### 3.1 Créer un service Web

1. Aller sur [render.com](https://render.com)
2. Cliquer sur "New +" → "Web Service"
3. Connecter votre dépôt GitHub
4. Remplir les détails :
   - **Name** : astrorevise-api
   - **Root Directory** : backend
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`
   - **Plan** : Free (ou payant selon vos besoins)

### 3.2 Configurer les variables d'environnement

Ajouter les variables suivantes dans les "Environment" settings :

```
PORT=5000
NODE_ENV=production
DATABASE_URL=<Paste the External Database URL from Render PostgreSQL>
JWT_SECRET=<Generate a strong random string>
JWT_EXPIRY=7d
FRONTEND_URL=<Your Vercel frontend URL, e.g., https://astrorevise.vercel.app>
```

Pour générer une clé JWT sécurisée :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.3 Redéployer

Render redéploiera automatiquement à chaque push sur GitHub.

## Étape 4 : Déployer le Frontend sur Vercel

### 4.1 Via Vercel CLI

```bash
npm i -g vercel
cd frontend
vercel
```

Ou connecter directement votre dépôt GitHub sur vercel.com.

### 4.2 Configuration Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur "New Project"
3. Importer votre dépôt GitHub
4. Remplir les détails :
   - **Project Name** : astrorevise
   - **Framework Preset** : Vite
   - **Root Directory** : frontend
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

### 4.3 Configurer les variables d'environnement (optionnel)

Si vous avez besoin de variables d'environnement côté frontend :

```
VITE_API_URL=<Your Render backend URL, e.g., https://astrorevise-api.onrender.com>
```

Puis utiliser dans le code :
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

## Étape 5 : Configuration CORS

Mettre à jour la variable `FRONTEND_URL` du backend :

1. Aller dans Render Dashboard → astrorevise-api → Environment
2. Mettre à jour `FRONTEND_URL` avec l'URL Vercel (ex: `https://astrorevise.vercel.app`)
3. Cliquer sur "Save Changes"
4. Redéployer le service

## Étape 6 : Configuration du domaine personnalisé (optionnel)

### 6.1 Frontend (Vercel)

1. Aller sur Vercel Dashboard → astrorevise → Settings → Domains
2. Ajouter votre domaine
3. Suivre les instructions pour configurer les DNS

### 6.2 Backend (Render)

1. Aller sur Render Dashboard → astrorevise-api → Settings → Custom Domain
2. Ajouter un sous-domaine (ex: api.astrorevise.com)
3. Configurer les DNS records

## Étape 7 : Test de production

1. Accédez à votre URL Vercel frontend
2. Testez l'inscription et la connexion
3. Vérifiez que toutes les fonctionnalités marchent correctement
4. Vérifiez la connexion AnkiConnect (elle ne marchera que sur PC local)

## Troubleshooting

### "Build failed" sur Render
- Vérifier que le fichier `backend/package.json` existe
- Vérifier que les dépendances sont correctes
- Vérifier les logs Render pour plus de détails

### "CORS error" en production
- Vérifier que `FRONTEND_URL` est correctement configurée dans le backend
- Vérifier que l'URL frontend n'a pas de slash final

### "Database connection error"
- Vérifier que la `DATABASE_URL` est correcte
- Vérifier que la base de données est en ligne
- Vérifier que le schéma SQL a été exécuté

### Anki ne fonctionne pas en production
C'est normal ! AnkiConnect écoute sur localhost:8765, donc il ne fonctionne que sur votre PC local.
En production, les utilisateurs peuvent entrer manuellement leur taux de réussite Anki.

## Mise à jour en production

Pour mettre à jour le code en production :

```bash
# Faire vos modifications
git add .
git commit -m "Update: description"
git push origin main
```

Vercel et Render redéploieront automatiquement.

## Monitoring

### Vercel
- Analytics : Dashboard Vercel → Analytics
- Logs : Dashboard Vercel → Functions

### Render
- Metrics : Dashboard Render → Metrics
- Logs : Dashboard Render → Logs

## Sauvegarde de la base de données

### Automated backups (Render)
Render effectue automatiquement des sauvegardes. Pour les restaurer :

1. Aller dans Render Dashboard → PostgreSQL → Backups
2. Sélectionner un point de sauvegarde
3. Cliquer sur "Restore"

### Manual export
```bash
pg_dump <DATABASE_URL> > backup.sql
```

### Manual import
```bash
psql <DATABASE_URL> < backup.sql
```

## Coûts estimés

- **Vercel** : Gratuit pour le frontend (généralement)
- **Render** : ~$7/mois pour PostgreSQL + ~$7/mois pour le backend Web Service
- **Domaine** : ~$10-15/an

## Sécurité en production

1. ✅ Utiliser des HTTPS (automatique sur Vercel et Render)
2. ✅ JWT_SECRET doit être long et aléatoire
3. ✅ DATABASE_URL doit être privée (variables d'environnement)
4. ✅ Activer les firewalls si disponible
5. ✅ Mettre à jour les dépendances régulièrement
6. ✅ Monitorer les logs d'erreurs

---

Votre application AstroRevise est maintenant déployée en production ! 🎉
