import { Router } from 'express';
import { noteController } from '../controllers/noteController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/:chapterId', noteController.getNotes);
router.get('/note/:id', noteController.getNoteById);

router.post('/', noteController.createNote);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

export default router;
