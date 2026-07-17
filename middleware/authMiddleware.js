const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  try {
    const userId = req.cookies && req.cookies.userId;
    if (!userId) {
      return res.redirect('/signin');
    }

    const user = await User.findById(userId).select('_id');
    if (!user) {
      res.clearCookie('userId');
      return res.redirect('/signin');
    }

    req.userId = user._id.toString();
    return next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.clearCookie('userId');
    return res.redirect('/signin');
  }
};

const redirectIfAuthenticated = async (req, res, next) => {
  try {
    const userId = req.cookies && req.cookies.userId;
    if (!userId) {
      return next();
    }

    const user = await User.findById(userId).select('_id');
    if (!user) {
      res.clearCookie('userId');
      return next();
    }

    return res.redirect('/dashboard');
  } catch (err) {
    console.error('Auth redirect middleware error:', err);
    res.clearCookie('userId');
    return next();
  }
};

module.exports = requireAuth;
module.exports.requireAuth = requireAuth;
module.exports.redirectIfAuthenticated = redirectIfAuthenticated;
