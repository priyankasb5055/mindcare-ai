import express from 'express';
import {
  chatWithAI,
  analyzeMood,
  getJournalPrompt
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', protect, chatWithAI);
router.post('/analyze-mood', protect, analyzeMood);
router.post('/journal-prompt', protect, getJournalPrompt);

export default router;
