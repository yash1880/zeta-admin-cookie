const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

exports.getSignin = (req, res) => {
  res.render('signin');
};

exports.postSignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid email or password');
    }

    res.cookie('userId', user._id.toString(), {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
};

exports.getSignup = (req, res) => {
  res.render('signup');
};

exports.postSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).send('First name, last name, email and password are required');
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).send('Email already registered');
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      password: hashed,
      role: 'User',
      isActive: true,
      mobile: '',
      gender: '',
      photo: ''
    });

    await Admin.create({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      username: '',
      email,
      password: hashed,
      role: 'User',
      mobile: '',
      gender: '',
      city: '',
      photo: ''
    });

    return res.redirect('/signin');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
};

exports.logout = (req, res) => {
  res.clearCookie('userId');
  res.redirect('/signin');
};
