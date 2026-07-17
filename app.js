const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const adminRoutes = require('./route/adminRoutes');
const authRoutes = require('./route/authRoutes');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { requireAuth, redirectIfAuthenticated } = require('./middleware/authMiddleware');

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', redirectIfAuthenticated, (req, res) => {
    res.redirect('/signin');
});

app.use('/', authRoutes);

app.use('/admin', requireAuth, adminRoutes);
app.get('/dashboard', requireAuth, (req, res) => {
    res.render('dashboard');
});

// Temporary debug route to clear the `userId` cookie (useful for testing only)
app.get('/debug/clear-user-cookie', (req, res) => {
    res.clearCookie('userId');
    return res.send('userId cookie cleared');
});

const server = app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.error(`Error: port ${PORT} is already in use.`);
        console.error('Use: `npx kill-port 3000` or find and kill the process using the port.');
        process.exit(1);
    }
    console.error('Server error:', err);
});

