# Architecture d'AstroRevise

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
│                  (http://localhost:5173)                │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐   │
│  │  Dashboard  │  │ Chapters    │  │  Calendar    │   │
│  ├─────────────┤  ├─────────────┤  ├──────────────┤   │
│  │  QCM Quiz   │  │ Notes       │  │ Tasks        │   │
│  └─────────────┘  └─────────────┘  └──────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/REST API
                         │
┌────────────────────────┴────────────────────────────────┐
│                 Backend (Express.js)                    │
│              (http://localhost:5000)                    │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │ Auth Routes  │  │ Chapter Rts  │  │ QCM Routes    │ │
│  ├──────────────┤  ├──────────────┤  ├───────────────┤ │
│  │ Task Routes  │  │ Note Routes  │  │ Resource Rts  │ │
│  └──────────────┘  └──────────────┘  └───────────────┘ │
│         ▼                ▼                    ▼          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Services Layer (Business Logic)                 │  │
│  │  ├─ authService                                  │  │
│  │  ├─ chapterService                               │  │
│  │  ├─ noteService                                  │  │
│  │  ├─ qcmService                                   │  │
│  │  ├─ taskService                                  │  │
│  │  ├─ resourceService                              │  │
│  │  └─ ankiService                                  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ PostgreSQL Driver
                         │
┌────────────────────────┴────────────────────────────────┐
│           PostgreSQL Database                          │
│           (postgresql://user:pass@host:5432/astrorevise)
└─────────────────────────────────────────────────────────┘
        │                            │
        │                            │
  ┌─────▼──────────────────────────┬─────┐
  │  AnkiConnect (Optional)         │     │
  │  (http://localhost:8765)        │     │
  └─────────────────────────────────┘     │
                                          │
                                   Storage/CDN
                                   (Supabase/Cloudinary)
```

## Structure des dossiers

```
SITE REVISION/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Logique des requêtes HTTP
│   │   │   ├── authController.ts
│   │   │   ├── chapterController.ts
│   │   │   ├── noteController.ts
│   │   │   ├── qcmController.ts
│   │   │   ├── taskController.ts
│   │   │   └── resourceController.ts
│   │   │
│   │   ├── routes/             # Définition des endpoints
│   │   │   ├── authRoutes.ts
│   │   │   ├── chapterRoutes.ts
│   │   │   ├── noteRoutes.ts
│   │   │   ├── qcmRoutes.ts
│   │   │   ├── taskRoutes.ts
│   │   │   └── resourceRoutes.ts
│   │   │
│   │   ├── services/           # Logique métier
│   │   │   ├── authService.ts
│   │   │   ├── chapterService.ts
│   │   │   ├── noteService.ts
│   │   │   ├── qcmService.ts
│   │   │   ├── taskService.ts
│   │   │   ├── resourceService.ts
│   │   │   └── ankiService.ts
│   │   │
│   │   ├── middleware/         # Middleware Express
│   │   │   └── auth.ts
│   │   │
│   │   ├── database/           # Configuration DB
│   │   │   ├── connection.ts
│   │   │   └── seed.sql
│   │   │
│   │   ├── types/              # Définitions TypeScript
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/              # Utilitaires
│   │   │
│   │   └── app.ts              # Configuration Express
│   │
│   ├── .env.example
│   ├── .eslintrc.json
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Composants React réutilisables
│   │   │   ├── Navigation.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   ├── ChapterCard.tsx
│   │   │   ├── FormElements.tsx
│   │   │   ├── RichTextEditor.tsx
│   │   │   ├── QCMForm.tsx
│   │   │   └── QCMQuiz.tsx
│   │   │
│   │   ├── pages/              # Pages principales
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ChaptersPage.tsx
│   │   │   ├── ChapterDetailPage.tsx
│   │   │   └── CalendarPage.tsx
│   │   │
│   │   ├── hooks/              # React hooks personnalisés
│   │   │   ├── useAuth.ts
│   │   │   ├── useAuthForm.ts
│   │   │   ├── useTodayTasks.ts
│   │   │   └── useLowMasteryChapters.ts
│   │   │
│   │   ├── services/           # Services API
│   │   │   └── api.ts
│   │   │
│   │   ├── types/              # Types TypeScript
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/              # Utilitaires
│   │   │
│   │   ├── styles/             # Feuilles de style
│   │   │   └── globals.css
│   │   │
│   │   ├── App.tsx             # Composant racine
│   │   └── main.tsx            # Point d'entrée
│   │
│   ├── public/                 # Assets statiques
│   ├── .env.example
│   ├── .eslintrc.json
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── database/
│   └── schema.sql              # Schéma complet
│
├── README.md
├── .gitignore
├── install.sh                  # Script d'installation
└── dev.sh                       # Script de développement
```

## Flux de données

### Authentification
1. L'utilisateur se connecte via le formulaire LoginPage
2. Les credentials sont envoyés au backend via `apiClient.login()`
3. Le backend valide les credentials et retourne un JWT
4. Le JWT est stocké dans localStorage et Zustand store
5. Chaque requête API inclut le JWT dans l'header Authorization
6. Le middleware `authMiddleware` valide le JWT

### Gestion des chapitres
1. Récupération de l'arborescence (Matière → Thème → Chapitre)
2. Affichage des chapitres avec leur mastery
3. L'utilisateur peut créer/modifier/supprimer des chapitres
4. Chaque chapitre peut contenir des notes, files, vidéos, QCM, et cartes Anki

### Passage d'un QCM
1. L'utilisateur sélectionne "Passer un QCM" pour un chapitre
2. Le frontend demande au backend `startQCM` pour récupérer les questions aléatoires
3. Les questions sont affichées une par une (sans les bonnes réponses)
4. L'utilisateur répond à chaque question
5. Après validation, le frontend soumet les réponses via `submitQCM`
6. Le backend calcule le score et met à jour la mastery du chapitre
7. Les résultats sont affichés à l'utilisateur

### Intégration Anki
1. Au démarrage, l'app vérifie la connexion AnkiConnect
2. Si disponible, l'utilisateur peut créer des cartes Anki
3. Les cartes sont sauvegardées en base de données ET envoyées à Anki
4. Si AnkiConnect n'est pas disponible, l'utilisateur peut saisir manuellement le taux de réussite

## Stack technique détaillée

### Frontend
- **React 18** : Framework UI moderne
- **Vite** : Bundler ultra-rapide
- **TypeScript** : Typage statique
- **TailwindCSS** : Utility-first CSS
- **Zustand** : Gestion d'état minimaliste
- **TipTap** : Éditeur de texte riche basé sur ProseMirror
- **date-fns** : Manipulation de dates
- **Axios** : Client HTTP
- **React Router** : Routage côté client

### Backend
- **Express.js** : Framework web Node.js
- **TypeScript** : Typage statique
- **PostgreSQL** : Base de données relationnelle
- **JWT** : Authentification sans session
- **bcryptjs** : Hachage de mots de passe
- **pg** : Driver PostgreSQL
- **Axios** : Client HTTP pour AnkiConnect

## Sécurité

1. **Authentification JWT** : Chaque requête API doit inclure un JWT valide
2. **Hachage des mots de passe** : Les mots de passe sont hachés avec bcrypt
3. **Isolation des données** : Chaque utilisateur ne voit que ses propres données
4. **CORS** : Configuré pour accepter les requêtes depuis le frontend
5. **Validation des données** : Validation côté backend pour tous les inputs

## Performance

1. **Lazy loading** : Les pages et composants sont chargés à la demande
2. **Optimisation des images** : Support des formats modernes
3. **Caching** : Les données utilisateur sont mises en cache avec Zustand
4. **Database indexes** : Tous les IDs et dates ont des index
5. **Code splitting** : Vite crée automatiquement des chunks séparés

---

Pour plus de détails, consultez le README.md et la documentation API.
