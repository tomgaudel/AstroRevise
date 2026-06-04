# Notes de développement

## 🎯 Fonctionnalités complètes

✅ Authentification (Inscription/Connexion)
✅ Gestion des chapitres (CRUD)
✅ Prise de notes (Éditeur riche)
✅ QCM (Création et passage)
✅ Calcul de maîtrise basé sur scores QCM
✅ Planification (Calendrier + Todo list)
✅ Intégration AnkiConnect
✅ Export des données utilisateur
✅ Design responsive et moderne
✅ Isolation des données par utilisateur

## 🔄 Flux de travail de développement

### Ajouter une nouvelle fonctionnalité

1. **Backend** :
   - Ajouter le type TypeScript dans `backend/src/types/index.ts`
   - Créer le service dans `backend/src/services/`
   - Ajouter le contrôleur dans `backend/src/controllers/`
   - Créer les routes dans `backend/src/routes/`
   - Ajouter les migrations SQL si nécessaire

2. **Frontend** :
   - Ajouter les types dans `frontend/src/types/index.ts`
   - Ajouter les appels API dans `frontend/src/services/api.ts`
   - Créer le hook si logique réutilisable
   - Créer le composant dans `frontend/src/components/`
   - Ajouter la page si nécessaire dans `frontend/src/pages/`
   - Ajouter la route dans `frontend/src/App.tsx`

### Exemple : Ajouter une fonctionnalité "Tags" aux notes

**Backend** :
```typescript
// 1. Type
interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
}

// 2. Service (backend/src/services/tagService.ts)
export const tagService = {
  async createTag(userId: string, name: string, color: string) {
    // Implementation
  }
}

// 3. Controller (backend/src/controllers/tagController.ts)
export const tagController = {
  async createTag(req: Request, res: Response) {
    // Implementation
  }
}

// 4. Routes (backend/src/routes/tagRoutes.ts)
router.post('/tags', tagController.createTag);

// 5. SQL (backend/src/database/seed.sql)
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255),
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Frontend** :
```typescript
// 1. Type (frontend/src/types/index.ts)
export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
}

// 2. API (frontend/src/services/api.ts)
async createTag(name: string, color: string) {
  return this.client.post('/tags', { name, color });
}

// 3. Hook (frontend/src/hooks/useTags.ts)
export const useTags = () => {
  // Implementation
}

// 4. Composant (frontend/src/components/TagManager.tsx)
export const TagManager: React.FC = () => {
  // Implementation
}
```

## 📊 Architecture des données

### Hiérarchie des ressources

```
User
├── Matters (Maths, Physique)
│   └── Themes (Analyse, Algèbre)
│       └── Chapters (Dérivation, etc.)
│           ├── Notes
│           ├── Questions (QCM)
│           ├── FileResources
│           ├── Videos
│           ├── AnkiCards
│           └── QCMScores
└── Tasks (Schedulées à des dates)
```

### Relations clés

- Chaque ressource appartient à un User (isolation)
- Les Chapters contiennent plusieurs Notes, Questions, etc.
- Les Tasks peuvent être liées à un Chapter (optionnel)
- QCMScores sont calculés et stockés pour chaque chapitre

## 🔐 Sécurité

### Implémentées
✅ JWT pour l'authentification
✅ Hachage des mots de passe (bcrypt)
✅ CORS pour éviter les requêtes non-autorisées
✅ Vérification du user_id dans les requêtes
✅ Validation des données en backend

### À implémenter pour la production
⚠️ Rate limiting
⚠️ HTTPS forcé
⚠️ CSRF protection
⚠️ Content Security Policy
⚠️ Audit logging
⚠️ 2FA (authentification multi-facteur)

## 🎨 Palette de design

- **Couleur primaire** : #C026D3 (Violet néon)
- **Couleur secondaire** : #BF00FF (Violet foncé)
- **Fond** : Dégradé slate-50 à slate-100
- **Texte** : slate-900
- **Accents** : Dégradés doux, ombres légères

## 📈 Métriques de progression

Les utilisateurs voient leur progression via :

1. **Mastery par chapitre** (0-100%) = moyenne des 3 derniers scores QCM
2. **Tableau de bord** avec chapitres faibles (< 70%)
3. **Calendrier** avec tâches complétées
4. **Stats** détaillées par chapitre

## 🐛 Bugs connus / À améliorer

- [ ] Pagination pour les gros chapitres
- [ ] Recherche et filtrage avancés
- [ ] Synchronisation temps réel (WebSocket)
- [ ] Collaboration entre utilisateurs
- [ ] Mode hors ligne (PWA)
- [ ] Intégration avec des tests standards (BAC, etc.)
- [ ] Mobile app native (React Native)

## 📚 Ressources utiles

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [TailwindCSS Docs](https://tailwindcss.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/)
- [AnkiConnect API](https://github.com/FooSoft/anki-connect)

## 🚀 Performance optimizations possibles

1. Utiliser des cache Redis pour les chapitres populaires
2. Pagination côté backend pour les listes
3. Compression gzip pour les requêtes API
4. CDN pour les fichiers statiques
5. Lazy loading des images
6. Code splitting du JavaScript
7. Database query optimization

## 📝 Checklist de production

Avant de déployer :

- [ ] Vérifier que JWT_SECRET est changé
- [ ] Vérifier que tous les `.env` sont corrects
- [ ] Lancer `npm run build` et `npm run typecheck`
- [ ] Tester l'export de données
- [ ] Tester la suppression de compte
- [ ] Vérifier les erreurs dans la console
- [ ] Tester sur mobile
- [ ] Mettre en place les backups BD
- [ ] Configurer les logs
- [ ] Activer HTTPS partout

---

Dernière mise à jour : Juin 2026
