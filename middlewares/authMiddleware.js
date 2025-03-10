import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    console.log(req.cookies);
    console.log(token);
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const resp = await User.findById(decodedToken.userId).select(
        'isAdmin email'
      );
      console.log(resp);
      req.user = {
        email: resp.email,
        isAdmin: resp.isAdmin,
        userId: decodedToken.userId,
      };

      next();
    } else {
      return res
        .status(401)
        .json({ status: false, message: 'Not Authorized. Try again later.' });
    }
  } catch (error) {
    console.log('error', error);
    return res.status(401).json({
      message: 'Not authorized. Try logging in again',
      status: false,
    });
  }
};

const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      message: 'Not authorized. Try logging in as an admin',
      status: false,
    });
  }
};

export { protectRoute, isAdminRoute };
