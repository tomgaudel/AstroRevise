import { Router } from 'express';
import { chapterController } from '../controllers/chapterController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/matters', chapterController.getMatters);
router.get('/themes', chapterController.getThemes);
router.get('/chapters', chapterController.getChapters);
router.get('/chapters/:id', chapterController.getChapterById);

router.post('/themes', chapterController.createTheme);
router.post('/chapters', chapterController.createChapter);

router.put('/chapters/:id', chapterController.updateChapter);
router.delete('/chapters/:id', chapterController.deleteChapter);

export default router;
