import { useState, useEffect } from 'react';
import { departmentAPI, documentAPI } from '../services/api';

export default function DocumentsPage() {
    const [documents, setDocuments] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Load departments on mount
    useEffect(() => {
        loadDepartments();
    }, []);

    // Load semesters when department changes
    useEffect(() => {
        if (selectedDepartment) {
            loadSemesters(selectedDepartment);
        } else {
            setSemesters([]);
            setSelectedSemester('');
        }
    }, [selectedDepartment]);

    // Load documents when filters change
    useEffect(() => {
        loadDocuments();
    }, [selectedDepartment, selectedSemester, searchQuery]);

    const loadDepartments = async () => {
        try {
            const response = await departmentAPI.getAll();
            setDepartments(response.data.data);
        } catch (err) {
            console.error('Error loading departments:', err);
        }
    };

    const loadSemesters = async (departmentId) => {
        try {
            const response = await departmentAPI.getSemesters(departmentId);
            setSemesters(response.data.data);
        } catch (err) {
            console.error('Error loading semesters:', err);
        }
    };

    const loadDocuments = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = {};
            if (selectedDepartment) params.departmentId = selectedDepartment;
            if (selectedSemester) params.semesterId = selectedSemester;
            if (searchQuery) params.search = searchQuery;

            console.log('📄 Loading documents with params:', params);

            const response = await documentAPI.getAll(params);

            console.log('✅ Documents loaded successfully:', {
                count: response.data.data.length,
                pagination: response.data.pagination
            });

            setDocuments(response.data.data);
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Failed to load documents';
            setError(errorMessage);

            console.error('❌ Error loading documents:', {
                message: err.message,
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data,
                params
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (doc) => {
        try {
            await documentAPI.incrementDownload(doc.id);

            // Extract file extension from file_type or URL
            let fileExtension = '';
            if (doc.file_type) {
                const mimeToExt = {
                    'application/pdf': '.pdf',
                    'application/msword': '.doc',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
                    'application/vnd.ms-powerpoint': '.ppt',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
                    'image/jpeg': '.jpg',
                    'image/png': '.png'
                };
                fileExtension = mimeToExt[doc.file_type] || '';
            }

            // Try to fetch and download the file
            console.log('📥 Downloading file from:', doc.file_url);
            const response = await fetch(doc.file_url, {
                mode: 'cors',
                credentials: 'omit'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            console.log('✅ File blob received:', {
                size: blob.size,
                type: blob.type
            });

            if (blob.size === 0) {
                throw new Error('Downloaded file is empty (0 bytes)');
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = (doc.title || 'download') + fileExtension;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('❌ Error downloading document:', {
                message: err.message,
                doc: doc.title,
                url: doc.file_url
            });
            // Fallback to opening in new tab if download fails
            alert('Direct download failed. Opening file in new tab instead.');
            window.open(doc.file_url, '_blank');
        }
    };

    const handleDelete = async (docId) => {
        if (!confirm('Are you sure you want to delete this document?')) return;

        try {
            await documentAPI.delete(docId);
            loadDocuments();
        } catch (err) {
            alert('Failed to delete document');
            console.error('Error deleting document:', err);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="container">
            <h1 style={titleStyle}>📚 Documents</h1>

            {/* Filters */}
            <div className="card" style={filtersStyle}>
                <div style={filterGridStyle}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Department</label>
                        <select
                            className="form-select"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                        >
                            <option value="">All Departments</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name} ({dept.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Semester</label>
                        <select
                            className="form-select"
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            disabled={!selectedDepartment}
                        >
                            <option value="">All Semesters</option>
                            {semesters.map((sem) => (
                                <option key={sem.id} value={sem.id}>
                                    Semester {sem.semester_number}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Search</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search documents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Documents List */}
            {loading ? (
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            ) : error ? (
                <div className="alert alert-error">{error}</div>
            ) : documents.length === 0 ? (
                <div className="card text-center">
                    <p style={{ color: 'var(--text-secondary)' }}>
                        No documents found. Try adjusting your filters or upload a new document.
                    </p>
                </div>
            ) : (
                <div style={documentsGridStyle}>
                    {documents.map((doc) => (
                        <div key={doc.id} className="card" style={documentCardStyle}>
                            <div style={cardHeaderStyle}>
                                <h3 style={docTitleStyle}>{doc.title}</h3>
                                <span style={badgeStyle}>
                                    {doc.department_code} - Sem {doc.semester_number}
                                </span>
                            </div>

                            {doc.description && (
                                <p style={descriptionStyle}>{doc.description}</p>
                            )}

                            <div style={metaStyle}>
                                <span>📁 {formatFileSize(doc.file_size)}</span>
                                <span>👤 {doc.uploader_name || 'Anonymous'}</span>
                                <span>📅 {formatDate(doc.created_at)}</span>
                                <span>⬇️ {doc.download_count} downloads</span>
                            </div>

                            <div style={actionsStyle}>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleDownload(doc)}
                                >
                                    📥 Download
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(doc.id)}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const titleStyle = {
    fontSize: 'var(--text-3xl)',
    marginBottom: 'var(--spacing-lg)',
    color: 'var(--text-primary)'
};

const filtersStyle = {
    marginBottom: 'var(--spacing-xl)'
};

const filterGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 'var(--spacing-lg)'
};

const documentsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: 'var(--spacing-lg)'
};

const documentCardStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)'
};

const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 'var(--spacing-sm)'
};

const docTitleStyle = {
    fontSize: 'var(--text-lg)',
    fontWeight: '600',
    color: 'var(--text-primary)',
    flex: 1
};

const badgeStyle = {
    backgroundColor: 'var(--primary)',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-xs)',
    fontWeight: '500',
    whiteSpace: 'nowrap'
};

const descriptionStyle = {
    color: 'var(--text-secondary)',
    fontSize: 'var(--text-sm)',
    lineHeight: '1.5'
};

const metaStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-md)',
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)'
};

const actionsStyle = {
    display: 'flex',
    gap: 'var(--spacing-sm)',
    marginTop: 'auto'
};
