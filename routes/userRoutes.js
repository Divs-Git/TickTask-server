import express from 'express';
import { isAdminRoute, protectRoute } from '../middlewares/authMiddleware';
import { registerUser } from '../controllers/userController';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

export default router;
