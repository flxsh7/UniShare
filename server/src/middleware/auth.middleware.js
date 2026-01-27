import { clerkClient } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';

dotenv.config();

// Middleware to verify Clerk authentication
export const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized - No token provided'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            // Verify the JWT token with Clerk
            const payload = await clerkClient.verifyToken(token, {
                secretKey: process.env.CLERK_SECRET_KEY
            });

            if (!payload || !payload.sub) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized - Invalid token'
                });
            }

            // Get user details
            const user = await clerkClient.users.getUser(payload.sub);

            // Attach user info to request
            req.auth = {
                userId: user.id,
                email: user.emailAddresses[0]?.emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                role: user.publicMetadata?.role || 'user'
            };

            next();
        } catch (verifyError) {
            console.error('Token verification error:', verifyError);
            return res.status(401).json({
                success: false,
                error: 'Unauthorized - Token verification failed'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error during authentication'
        });
    }
};

// Middleware to check if user is admin
export const requireAdmin = (req, res, next) => {
    if (req.auth?.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Forbidden - Admin access required'
        });
    }
    next();
};
