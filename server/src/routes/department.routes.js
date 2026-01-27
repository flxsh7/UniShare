import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import {
    getDepartments,
    getSemestersByDepartment,
    createDepartment,
    deleteDepartment
} from '../controllers/department.controller.js';

const router = express.Router();

// Public routes
router.get('/', getDepartments);
router.get('/:departmentId/semesters', getSemestersByDepartment);

// Admin routes
router.post('/', requireAuth, requireAdmin, createDepartment);
router.delete('/:id', requireAuth, requireAdmin, deleteDepartment);

export default router;
