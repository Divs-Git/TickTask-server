import User from '../models/User';
import { createJWT } from '../utils';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin, role, title } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists',
        status: false,
      });
    }
    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
      role,
      title,
    });

    if (user) {
      isAdmin ? createJWT(user._id, res) : null;

      user.password = undefined;
      res.status(201).json({
        user,
        message: 'User created successfully',
        status: true,
      });
    } else {
      return res.status(400).json({
        message: 'Invalid user data',
        status: false,
      });
    }
  } catch (error) {
    console.log('error', error);
    return res.status(401).json({
      message: error.message,
      status: false,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password',
        status: false,
      });
    }

    if (!user.isActive) {
      return res.status(400).json({
        message: 'User is inactive',
        status: false,
      });
    }

    const isPasswordMatch = await user.matchPassword(password);

    if (user && isPasswordMatch) {
      createJWT(user._id, res);

      user.password = undefined;
      res.status(200).json({
        user,
        message: 'User logged in successfully',
        status: true,
      });
    } else {
      return res.status(400).json({
        message: 'Invalid password',
        status: false,
      });
    }
  } catch (error) {
    console.log('error', error);
    return res.status(401).json({
      message: error.message,
      status: false,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie('token', null, {
      httpOnly: true,
      expires: new Date(0),
      sameSite: 'strict',
      secure: process.env.NODE_ENV !== 'development',
    });

    res.status(200).json({
      message: 'User logged out successfully',
      status: true,
    });
  } catch (error) {
    console.log('error', error);
    return res.status(401).json({
      message: error.message,
      status: false,
    });
  }
};
