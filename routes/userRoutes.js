import express from 'express';
import { isAdminRoute, protectRoute } from '../middlewares/authMiddleware.js';
import {
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  getNotificationsList,
  getTeamList,
  loginUser,
  logoutUser,
  markNotificationRead,
  registerUser,
  updateUserProfile,
} from '../controllers/userController.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Protected routes
router.get('/get-team', protectRoute, isAdminRoute, getTeamList);
router.get('notifications', protectRoute, getNotificationsList);
router.put('/profile', protectRoute, updateUserProfile);
router.put('/read-notification', protectRoute, markNotificationRead);
router.put('/change-password', protectRoute, changeUserPassword);

// For admin only
router
  .route('/:id')
  .put(protectRoute, isAdminRoute, activateUserProfile)
  .delete(protectRoute, isAdminRoute, deleteUserProfile);
export default router;
