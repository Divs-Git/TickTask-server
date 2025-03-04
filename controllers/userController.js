import User from '../models/user.js';
import { createJWT } from '../utils/index.js';
import Notification from './../models/notification.js';

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

export const getTeamList = async (req, res) => {
  try {
    const users = await User.find().select('name title role email isActive');

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getNotificationsList = async (req, res) => {
  try {
    const { userId } = req.user;

    const nofication = await Notification.find({
      team: userId,
      isRead: { $nin: [userId] },
    }).populate('task', 'title');

    res.status(201).json(nofication);
  } catch (error) {
    console.log('error', error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;

    const { _id } = req.body;

    const id =
      isAdmin && userId === _id // admin updating own profile
        ? userId
        : isAdmin && userId !== _id // admin updating other user profile
        ? _id
        : userId; // user updating own profile

    const user = await User.findById(id);

    if (user) {
      user.name = req.body.name || user.name;
      user.title = req.body.title || user.title;
      user.role = req.body.role || user.role;

      const updatedUser = await user.save();

      user.password = undefined;

      res.status(201).json({
        status: true,
        message: 'Profile Updated Successfully',
        user: updatedUser,
      });
    } else {
      res.status(404).json({ status: false, message: 'User not found' });
    }
  } catch (error) {
    console.log('error', error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { userId } = req.user;
    const { isReadType, id } = req.query;

    if (isReadType === 'all') {
      await Notification.updateMany(
        {
          team: userId,
          isRead: {
            $nin: [userId],
          },
        },
        { $push: { isRead: userId } },
        {
          new: true,
        }
      );
    } else {
      await Notification.findOneAndUpdate(
        {
          _id: id,
          isRead: {
            $nin: [userId],
          },
        },
        {
          $push: { isRead: userId },
        },
        {
          new: true,
        }
      );
    }
  } catch (error) {
    console.log('error', error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);

    if (user) {
      user.password = req.body.password;

      await user.save();
      user.password = undefined;
      res.status(201).json({
        status: true,
        message: 'Password changed successfully',
      });
    } else {
      return res.status(404).json({ status: false, message: 'User not found' });
    }
  } catch (error) {
    console.log('error', error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const activateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user) {
      user.isActive = req.body.isActive; //!user.isActive

      await user.save();

      res.status(201).json({
        status: true,
        message: `User account has been ${
          user.isActive ? 'activated' : 'disabled'
        }`,
      });
    } else {
      res.status(404).json({ status: false, message: 'User not found' });
    }
  } catch (error) {
    console.log('error', error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ status: true, message: 'User deleted successfully' });
  } catch (error) {
    console.log('error', error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
