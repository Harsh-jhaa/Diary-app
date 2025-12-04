import express from 'express';
import User from '../models/UserModel.js';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
} from '../controllers/authControllers.js';
import { refreshAccessTokenController } from '../controllers/tokenController.js';

const router = express.Router();

router.post('/register-user', registerUserController);
router.post('/login-user', loginUserController);
router.post('/logout-user', logoutUserController);
router.post('/refresh-token', refreshAccessTokenController);

export default router;
