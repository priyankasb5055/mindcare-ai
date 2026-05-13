import express from 'express';
import {
  createMood,
  getMoods,
  getMoodStats,
  deleteMood
} from '../controllers/moodController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createMood)
  .get(protect, getMoods);

router.route('/stats')
  .get(protect, getMoodStats);

router.route('/:id')
  .delete(protect, deleteMood);

export default router;
