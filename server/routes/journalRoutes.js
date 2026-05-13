import express from 'express';
import {
  createJournal,
  getJournals,
  getJournalById,
  updateJournal,
  deleteJournal
} from '../controllers/journalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createJournal)
  .get(protect, getJournals);

router.route('/:id')
  .get(protect, getJournalById)
  .put(protect, updateJournal)
  .delete(protect, deleteJournal);

export default router;
