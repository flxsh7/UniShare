import { query } from '../config/db.js';
import cloudinary from '../config/cloudinary.js';

// Upload document
export const uploadDocument = async (req, res, next) => {
    try {
        const { title, description, departmentId, semesterId } = req.body;
        const file = req.file;

        // Validate required fields
        if (!title || !departmentId || !semesterId || !file) {
            return res.status(400).json({
                success: false,
                error: 'Title, department, semester, and file are required'
            });
        }

        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'unishare-documents',
                    resource_type: 'auto',
                    use_filename: true,
                    unique_filename: true
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(file.buffer);
        });

        // Save document metadata to database
        const result = await query(
            `INSERT INTO documents 
       (title, description, file_url, file_type, file_size, cloudinary_public_id, 
        department_id, semester_id, uploaded_by, uploader_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
            [
                title,
                description || null,
                uploadResult.secure_url,
                file.mimetype,
                file.size,
                uploadResult.public_id,
                departmentId,
                semesterId,
                req.auth.userId,
                req.auth.fullName
            ]
        );

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Document uploaded successfully'
        });
    } catch (error) {
        console.error('Upload error:', error);
        next(error);
    }
};

// Get documents with filters
export const getDocuments = async (req, res, next) => {
    try {
        const { departmentId, semesterId, search, page = 1, limit = 20 } = req.query;

        console.log('📄 GET /api/documents - Request params:', {
            departmentId,
            semesterId,
            search,
            page,
            limit
        });

        let queryText = `
      SELECT d.*, 
             dep.name as department_name, 
             dep.code as department_code,
             s.semester_number
      FROM documents d
      JOIN departments dep ON d.department_id = dep.id
      JOIN semesters s ON d.semester_id = s.id
      WHERE 1=1
    `;

        const queryParams = [];
        let paramCount = 1;

        // Filter by department
        if (departmentId) {
            queryText += ` AND d.department_id = $${paramCount}`;
            queryParams.push(departmentId);
            paramCount++;
        }

        // Filter by semester
        if (semesterId) {
            queryText += ` AND d.semester_id = $${paramCount}`;
            queryParams.push(semesterId);
            paramCount++;
        }

        // Search by title or description
        if (search) {
            queryText += ` AND (d.title ILIKE $${paramCount} OR d.description ILIKE $${paramCount})`;
            queryParams.push(`%${search}%`);
            paramCount++;
        }

        // Add ordering and pagination
        queryText += ` ORDER BY d.created_at DESC`;
        queryText += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        queryParams.push(limit, (page - 1) * limit);

        console.log('🔍 Executing query with params:', queryParams);

        const result = await query(queryText, queryParams);

        console.log(`✅ Found ${result.rows.length} documents`);

        // Get total count
        let countQuery = `SELECT COUNT(*) FROM documents d WHERE 1=1`;
        const countParams = [];
        let countParamIndex = 1;

        if (departmentId) {
            countQuery += ` AND d.department_id = $${countParamIndex}`;
            countParams.push(departmentId);
            countParamIndex++;
        }

        if (semesterId) {
            countQuery += ` AND d.semester_id = $${countParamIndex}`;
            countParams.push(semesterId);
            countParamIndex++;
        }

        if (search) {
            countQuery += ` AND (d.title ILIKE $${countParamIndex} OR d.description ILIKE $${countParamIndex})`;
            countParams.push(`%${search}%`);
        }

        const countResult = await query(countQuery, countParams);
        const totalCount = parseInt(countResult.rows[0].count);

        console.log(`📊 Total count: ${totalCount}`);

        res.json({
            success: true,
            data: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    } catch (error) {
        console.error('❌ Error in getDocuments:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        next(error);
    }
};

// Get single document
export const getDocument = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(
            `SELECT d.*, 
              dep.name as department_name, 
              dep.code as department_code,
              s.semester_number
       FROM documents d
       JOIN departments dep ON d.department_id = dep.id
       JOIN semesters s ON d.semester_id = s.id
       WHERE d.id = $1`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'Document not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// Increment download count
export const incrementDownloadCount = async (req, res, next) => {
    try {
        const { id } = req.params;

        await query(
            'UPDATE documents SET download_count = download_count + 1 WHERE id = $1',
            [id]
        );

        res.json({
            success: true,
            message: 'Download count updated'
        });
    } catch (error) {
        next(error);
    }
};

// Download file with proper headers (mobile-friendly)
export const downloadFile = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Get document details
        const result = await query(
            'SELECT * FROM documents WHERE id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'Document not found'
            });
        }

        const document = result.rows[0];

        // Increment download count
        await query(
            'UPDATE documents SET download_count = download_count + 1 WHERE id = $1',
            [id]
        );

        // Extract file extension from file_type
        const mimeToExt = {
            'application/pdf': '.pdf',
            'application/msword': '.doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
            'application/vnd.ms-powerpoint': '.ppt',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
            'image/jpeg': '.jpg',
            'image/png': '.png'
        };
        const fileExtension = mimeToExt[document.file_type] || '';
        const filename = `${document.title}${fileExtension}`;

        // Fetch file from Cloudinary and stream it to the client with proper headers
        const response = await fetch(document.file_url);

        if (!response.ok) {
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch file from storage'
            });
        }

        // Set proper headers for download
        res.setHeader('Content-Type', document.file_type);
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
        res.setHeader('Content-Length', document.file_size);

        // Stream the file to the client
        const buffer = await response.arrayBuffer();
        res.send(Buffer.from(buffer));
    } catch (error) {
        console.error('Download error:', error);
        next(error);
    }
};


// Delete document
export const deleteDocument = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Get document to check ownership and get cloudinary ID
        const docResult = await query(
            'SELECT * FROM documents WHERE id = $1',
            [id]
        );

        if (docResult.rowCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'Document not found'
            });
        }

        const document = docResult.rows[0];

        // Check if user is owner or admin
        if (document.uploaded_by !== req.auth.userId && req.auth.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to delete this document'
            });
        }

        // Delete from Cloudinary
        try {
            await cloudinary.uploader.destroy(document.cloudinary_public_id, {
                resource_type: 'raw'
            });
        } catch (cloudinaryError) {
            console.error('Cloudinary deletion error:', cloudinaryError);
            // Continue with database deletion even if Cloudinary fails
        }

        // Delete from database
        await query('DELETE FROM documents WHERE id = $1', [id]);

        res.json({
            success: true,
            message: 'Document deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
