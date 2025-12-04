import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../utils/generateTokens.js';

export const refreshAccessTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
    // verify refresh token validity for correctness
    const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decode.userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // compare refresh token with the one in db
    const match = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!match) {
      return res.status(400).json({ message: 'Invalid refresh token' });
    }

    // generate new access token
    const payload = { userId: user._id, email: user.email };
    const newAccessToken = createAccessToken(payload);

    return res.status(200).json({
      message: 'Access token refreshed successfully',
      accessToken: newAccessToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Invalid or expired refresh token',
        error: error.message,
      });
  }
};
