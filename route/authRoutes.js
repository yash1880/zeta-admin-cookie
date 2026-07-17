const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getSignin,
  postSignin,
  getSignup,
  postSignup,
  logout
} = require('../controller/authController');

router.get('/signin', authMiddleware.redirectIfAuthenticated, getSignin);
router.post('/signin', authMiddleware.redirectIfAuthenticated, postSignin);
router.get('/signup', authMiddleware.redirectIfAuthenticated, getSignup);
router.post('/signup', authMiddleware.redirectIfAuthenticated, postSignup);
router.get('/logout', logout);

module.exports = router;
