import express from 'express';
const router = express.Router();
import { getProfile, createOrUpdateProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect, getProfile).post(protect, createOrUpdateProfile);

export default router;