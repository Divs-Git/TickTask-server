import express from 'express';
import { isAdminRoute, protectRoute } from '../middlewares/authMiddleware.js';
import {
  getNotificationsList,
  getTeamList,
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/userController.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

// Protected routes
router.get('/get-team', protectRoute, isAdminRoute, getTeamList);
router.get('notifications', protectRoute, getNotificationsList);

export default router;
