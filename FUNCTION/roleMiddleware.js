import { sellerPool } from '../DATABASE/db.js';

export const checkRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;
            
            // Get user's role from database
            const [users] = await sellerPool.query(
                'SELECT role FROM users WHERE id = ?',
                [userId]
            );

            if (users.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const userRole = users[0].role;

            // Check if user has required role
            if (userRole !== requiredRole) {
                return res.status(403).json({ 
                    message: `Access denied. ${requiredRole} role required.` 
                });
            }

            next();
        } catch (error) {
            console.error('Role check error:', error);
            res.status(500).json({ message: 'Internal server error during role verification' });
        }
    };
};

// Helper middleware to check if user is a seller
export const isSeller = checkRole('seller');

// Helper middleware to check if user is an admin
export const isAdmin = checkRole('admin');

module.exports = {
    checkRole,
    isSeller,
    isAdmin
}; 