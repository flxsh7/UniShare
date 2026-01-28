import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { upload, handleUploadError } from '../middleware/upload.middleware.js';
import {
    uploadDocument,
    getDocuments,
    getDocument,
    incrementDownloadCount,
    downloadFile,
    deleteDocument
} from '../controllers/document.controller.js';

const router = express.Router();

// Public routes
router.get('/', getDocuments);
router.get('/:id', getDocument);
router.get('/:id/download-file', downloadFile); // Public for mobile browser compatibility

// Protected routes
router.post(
    '/upload',
    requireAuth,
    upload.single('file'),
    handleUploadError,
    uploadDocument
);

router.post('/:id/download', requireAuth, incrementDownloadCount);
router.delete('/:id', requireAuth, deleteDocument);

export default router;
