import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/admin/all-users', authenticateToken, async (req, res) => {
    try {
        const [users] = await db.query(`
            SELECT id, name, email, role, created_at AS joined_at, status, last_active
            FROM users
        `);
        const [admins] = await db.query(`
            SELECT id, name, email, role, created_at AS joined_at, status, last_active
            FROM admin
        `);
        
        res.json({
            success: true,
            data: [...users, ...admins]
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching users data'
        });
    }
});


router.get('/admin/all-users/filter', authenticateToken, async (req, res) => {
    try {
        const { role } = req.query;
        
        if (!role) {
            return res.status(400).json({
                success: false,
                message: 'Role parameter is required'
            });
        }

        let query = role === 'admin'
            ? 'SELECT id, name, email, role, created_at AS joined_at, status, last_active FROM admin'
            : 'SELECT id, name, email, role, created_at AS joined_at, status, last_active FROM users WHERE role = ?';
        
        const [results] = await db.query(query, role === 'admin' ? [] : [role]);
        
        res.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error filtering users:', error);
        res.status(500).json({
            success: false,
            message: 'Error filtering users by role'
        });
    }
});

// After the update user route, add this new delete endpoint
router.put('/admin/update-user/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, status, password } = req.body;

        // Convert ID to number if it's numeric
        const userId = isNaN(id) ? id : Number(id);

        // Enhanced user lookup with error details
        const [currentUser] = await db.query(`
            SELECT id, role FROM users WHERE id = ?
            UNION
            SELECT id, role FROM admin WHERE id = ?
        `, [userId, userId]);

        if (!currentUser.length) {
            return res.status(404).json({
                success: false,
                message: `User with ID ${userId} not found`,
                debugInfo: { userId, tablesChecked: ['users', 'admin'] }
            });
        }

        const currentRole = currentUser[0].role;
        const isRoleChanged = currentRole !== role;

        // Prepare update data with null checks
        // Prepare update data with bcrypt password hashing
        const updateData = {
            name: name || currentUser[0].name,
            email: email || currentUser[0].email,
            role: role || currentUser[0].role,
            status: status || currentUser[0].status,
        };

        // Only hash and add password if provided
        if (password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(password, saltRounds);
        }

        if (isRoleChanged) {
            try {
                await db.query('START TRANSACTION');
                
                // Delete from old table
                await db.query(
                    `DELETE FROM ${currentRole === 'admin' ? 'admin' : 'users'} WHERE id = ?`,
                    [userId]
                );

                // Insert into new table
                await db.query(
                    `INSERT INTO ${role === 'admin' ? 'admin' : 'users'} SET ?`,
                    [updateData]
                );

                await db.query('COMMIT');
            } catch (error) {
                await db.query('ROLLBACK');
                console.error('Transaction error:', error);
                throw error;
            }
        } else {
            await db.query(
                `UPDATE ${currentRole === 'admin' ? 'admin' : 'users'} SET ? WHERE id = ?`,
                [updateData, userId]
            );
        }

        res.json({
            success: true,
            message: 'User updated successfully',
            data: updateData
        });

    } catch (error) {
        console.error('Update error details:', {
            error: error.message,
            stack: error.stack,
            userId: req.params.id,
            requestBody: req.body
        });
        res.status(500).json({
            success: false,
            message: 'Error updating user data',
            debugInfo: {
                userId: req.params.id,
                error: error.message
            }
        });
    }
});

// Add the delete user endpoint
router.delete('/admin/delete-user/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Convert ID to number if it's numeric
        const userId = isNaN(id) ? id : Number(id);

        // Find which table the user exists in
        const [userExists] = await db.query(`
            SELECT id, role FROM users WHERE id = ?
            UNION
            SELECT id, role FROM admin WHERE id = ?
        `, [userId, userId]);

        if (!userExists.length) {
            return res.status(404).json({
                success: false,
                message: `User with ID ${userId} not found`
            });
        }

        const userRole = userExists[0].role;
        const tableName = userRole === 'admin' ? 'admin' : 'users';

        // Delete the user from the appropriate table
        await db.query(`DELETE FROM ${tableName} WHERE id = ?`, [userId]);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
});

export default router;