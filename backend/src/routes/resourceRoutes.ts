import { Router } from 'express';
import { resourceController } from '../controllers/resourceController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

// Files
router.post('/files', resourceController.addFile);
router.get('/files/:chapterId', resourceController.getFiles);
router.delete('/files/:id', resourceController.deleteFile);

// Videos
router.post('/videos', resourceController.addVideo);
router.get('/videos/:chapterId', resourceController.getVideos);
router.delete('/videos/:id', resourceController.deleteVideo);

// Anki
router.get('/anki/check', resourceController.checkAnkiConnection);
router.post('/anki/cards', resourceController.createAnkiCard);
router.get('/anki/cards/:chapterId', resourceController.getAnkiCards);
router.delete('/anki/cards/:id', resourceController.deleteAnkiCard);

// Export
router.get('/export/data', resourceController.exportUserData);

export default router;
