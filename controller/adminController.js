const Admin = require('../models/Admin');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// =============================================
// 1. DASHBOARD CONTROLLER
// =============================================
// ===== GET HOME PAGE =====
exports.getDashboard = async (req, res) => {
    try {
        res.render('dashboard', {
            title: 'Dashboard - Zeta Admin',
            user: { name: 'Admin' }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getAddAdmin = async (req, res) => {
    try {
        const editAdminId = req.query.id;
        const editAdmin = editAdminId ? await Admin.findById(editAdminId) : null;

        res.render('add-admin', {
            title: 'Add Admin - Zeta Admin',
            user: { name: 'Admin' },
            editAdmin
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getViewAdmin = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const search = req.query.search || '';

        const query = search
            ? {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { username: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const totalAdmins = await Admin.countDocuments(query);
        const totalPages = Math.ceil(totalAdmins / limit);
        const skip = (page - 1) * limit;

        const admins = await Admin.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.render('view-admin', {
            title: 'View Admin - Zeta Admin',
            user: { name: 'Admin' },
            admins,
            currentPage: page,
            totalPages,
            search
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.postAddAdmin = async (req, res) => {
    try {
        const { adminId, firstName, lastName, username, email, password, mobile, gender, role, city } = req.body;
        const fullName = `${firstName || ''} ${lastName || ''}`.trim() || username || 'Admin';

        if (adminId) {
            const updateData = {
                name: fullName,
                firstName: firstName || '',
                lastName: lastName || '',
                username: username || '',
                email,
                role: role || 'Admin',
                mobile: mobile || '',
                gender: gender || '',
                city: city || ''
            };

            if (req.file) {
                updateData.photo = '/assets/images/user/' + req.file.filename;
            }

            if (password) {
                updateData.password = await bcrypt.hash(password, 10);
            }

            await Admin.findByIdAndUpdate(adminId, updateData);
            return res.redirect('/admin/view-admin');
        }

        const hashedPassword = await bcrypt.hash(password || 'admin123', 10);

        const newAdmin = new Admin({
            name: fullName,
            firstName: firstName || '',
            lastName: lastName || '',
            username: username || '',
            email,
            password: hashedPassword,
            role: role || 'Admin',
            mobile: mobile || '',
            gender: gender || '',
            city: city || '',
            photo: req.file ? '/assets/images/user/' + req.file.filename : ''
        });

        await newAdmin.save();
        res.redirect('/admin/view-admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.deleteAdmin = async (req, res) => {
    try {
        await Admin.findByIdAndDelete(req.params.id);
        res.redirect('/admin/view-admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getAddUser = async (req, res) => {
    try {
        const editUserId = req.query.id;
        const editUser = editUserId ? await User.findById(editUserId) : null;

        res.render('add-user', {
            title: editUser ? 'Edit User - Zeta Admin' : 'Add User - Zeta Admin',
            user: { name: 'Admin' },
            editUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getViewUser = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const search = req.query.search || '';

        const query = search
            ? {
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { username: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);
        const skip = (page - 1) * limit;

        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.render('view-user', {
            title: 'View User - Zeta Admin',
            user: { name: 'Admin' },
            users,
            currentPage: page,
            totalPages,
            search
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.postAddUser = async (req, res) => {
    try {
        const { userId, firstName, lastName, username, email, password, mobile, gender, role, city } = req.body;
        const fullName = `${firstName || ''} ${lastName || ''}`.trim() || username || 'User';

        if (userId) {
            const updateData = {
                name: fullName,
                firstName: firstName || '',
                lastName: lastName || '',
                username: username || '',
                email,
                role: role || 'user',
                mobile: mobile || '',
                gender: gender || '',
                city: city || ''
            };

            if (password) {
                updateData.password = await bcrypt.hash(password, 10);
            }

            await User.findByIdAndUpdate(userId, updateData);
            return res.redirect('/admin/view-user');
        }

        const hashedPassword = await bcrypt.hash(password || 'user123', 10);

        const newUser = new User({
            name: fullName,
            firstName: firstName || '',
            lastName: lastName || '',
            username: username || '',
            email,
            password: hashedPassword,
            role: role || 'User',
            mobile: mobile || '',
            gender: gender || '',
            city: city || '',
            photo: ''
        });

        await newUser.save();
        res.redirect('/admin/view-user');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/admin/view-user');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
