import express from 'express';
import User from '../models/UserModel.js';
import {
  registerUserController,
  loginUserController,
} from '../controllers/authControllers.js';

const router = express.Router();

router.post('/register-user', registerUserController);
router.post('/login-user', loginUserController);
router.post('/refresh-token',  );

export default router;
