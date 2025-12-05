import express from 'express';
import User from '../models/UserModel.js';
import {
  createAccessToken,
  createRefreshToken,
} from '../utils/generateTokens.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Register user - signup
const registerUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all the fields' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    // Generate tokens
    const payload = { userId: newUser._id, email: newUser.email };
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    res.status(201).json({
      message: 'User registered successfully',
      newUser: { id: newUser._id, name: newUser.name, email: newUser.email },
      token: { accessToken, refreshToken },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Login user - signin
const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const payload = { userId: user._id, email: user.email };
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    // console.log('REFRESH TOKEN GENERATED AT LOGIN:', refreshToken);

    // hashing the refresh token before saving it to the database
    const SALT_ROUNDS = 10;
    user.refreshTokenHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
    await user.save();

    res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
      token: { accessToken, refreshToken },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const logoutUserController = async (req, res) => {
  try {

    // s1 getting token from cookie - frontend
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(200).json({
        message: 'logged out successfully (no token found)',
      });
    }

    //s2 - check in db for all non empty refresh token users
    const user = User.find({ refreshTokenHash: { $ne: null } });

    let matchedUser = null;
    for (const u of user) {
      // s3 - compare tokens to user in db
      const match = await bcrypt.compare(refreshToken, u.refreshTokenHash);
      if (match) {
        matchedUser = u;
        break;
      }
    }

    // s4 - if found, remove refresh token from db
    if (matchedUser) {
      matchedUser.refreshTokenHash = null;
      await matchedUser.save();
    }

    //s5 - cookie clear
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });

    return res.status(200).json({
      message: 'Logout successful',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Logout failed',
      error: error.message,
    });
  }
};

export { registerUserController, loginUserController, logoutUserController };
