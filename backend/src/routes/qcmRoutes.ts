import { Router } from 'express';
import { qcmController } from '../controllers/qcmController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/:chapterId', qcmController.getQuestions);
router.post('/', qcmController.createQuestion);
router.put('/:id', qcmController.updateQuestion);
router.delete('/:id', qcmController.deleteQuestion);

router.post('/start', qcmController.startQCM);
router.post('/submit', qcmController.submitQCM);

export default router;
