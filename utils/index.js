import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.log('error', error);
  }
};

export const createJWT = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'none', // prevent CSRF attacks
    secure: process.env.RENDER_ENV === 'production' || false,
    maxAge: 24 * 60 * 60 * 1000, // 1 day,
    secure: true,
    domain: 'http://localhost:3000',
  });
};
