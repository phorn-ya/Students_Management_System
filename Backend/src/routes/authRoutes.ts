import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();
const authController = new AuthController();

router.post('/register',authController.register.bind(authController) )
router.post('/login',authController.login.bind(authController));
router.get('/profile', authMiddleware, authController.getProfile.bind(authController));
router.post('/profile', authMiddleware, authController.getProfile.bind(authController));
router.post('/logout', authMiddleware,authController.logout.bind(authController));

export default router;
