const isAdmin = (req, res, next) => {
    try {
        const userEmail = req.user.email;
        const ADMIN_EMAIL = 'detailersedge135@gmail.com';

        if (userEmail !== ADMIN_EMAIL) {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ message: 'Error checking admin status' });
    }
};

module.exports = isAdmin; 