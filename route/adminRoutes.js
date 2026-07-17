const express = require('express');
const router = express.Router();

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'assets', 'images', 'user'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

const {
  getDashboard,
  getAddAdmin,
  getViewAdmin,
  postAddAdmin,
  deleteAdmin,
  getAddUser,
  getViewUser,
  postAddUser,
  deleteUser
} = require('../controller/adminController');

router.get('/', getDashboard);

router.get('/add-admin', getAddAdmin);
router.post('/add-admin', upload.single('photo'), postAddAdmin);
router.delete('/admin/:id', deleteAdmin);

router.get('/view-admin', getViewAdmin);

router.get('/add-user', getAddUser);
router.post('/add-user', postAddUser);
router.delete('/user/:id', deleteUser);

router.get('/view-user', getViewUser);

module.exports = router;