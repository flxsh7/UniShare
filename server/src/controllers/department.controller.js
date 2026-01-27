import { query } from '../config/db.js';

// Get all departments
export const getDepartments = async (req, res, next) => {
    try {
        const result = await query(
            'SELECT id, name, code, created_at FROM departments ORDER BY name ASC'
        );

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        next(error);
    }
};

// Get semesters by department
export const getSemestersByDepartment = async (req, res, next) => {
    try {
        const { departmentId } = req.params;

        const result = await query(
            `SELECT s.id, s.semester_number, s.department_id, d.name as department_name, d.code as department_code
       FROM semesters s
       JOIN departments d ON s.department_id = d.id
       WHERE s.department_id = $1
       ORDER BY s.semester_number ASC`,
            [departmentId]
        );

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        next(error);
    }
};

// Create new department (admin only)
export const createDepartment = async (req, res, next) => {
    try {
        const { name, code } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                success: false,
                error: 'Department name and code are required'
            });
        }

        const result = await query(
            'INSERT INTO departments (name, code) VALUES ($1, $2) RETURNING *',
            [name, code.toUpperCase()]
        );

        // Create semesters for the new department (1-8)
        const departmentId = result.rows[0].id;
        for (let i = 1; i <= 8; i++) {
            await query(
                'INSERT INTO semesters (semester_number, department_id) VALUES ($1, $2)',
                [i, departmentId]
            );
        }

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Department created successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Delete department (admin only)
export const deleteDepartment = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(
            'DELETE FROM departments WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'Department not found'
            });
        }

        res.json({
            success: true,
            message: 'Department deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
