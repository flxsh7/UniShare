import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { departmentAPI, documentAPI } from '../services/api';

export default function UploadPage() {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        departmentId: '',
        semesterId: '',
        file: null
    });

    useEffect(() => {
        loadDepartments();
    }, []);

    useEffect(() => {
        if (formData.departmentId) {
            loadSemesters(formData.departmentId);
        } else {
            setSemesters([]);
            setFormData(prev => ({ ...prev, semesterId: '' }));
        }
    }, [formData.departmentId]);

    const loadDepartments = async () => {
        try {
            const response = await departmentAPI.getAll();
            setDepartments(response.data?.data || []);
        } catch (err) {
            console.error('Error loading departments:', err);
            setDepartments([]);
        }
    };

    const loadSemesters = async (departmentId) => {
        try {
            const response = await departmentAPI.getSemesters(departmentId);
            setSemesters(response.data?.data || []);
        } catch (err) {
            console.error('Error loading semesters:', err);
            setSemesters([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (100MB)
            if (file.size > 100 * 1024 * 1024) {
                setError('File size must be less than 100MB');
                e.target.value = '';
                return;
            }
            setFormData(prev => ({ ...prev, file }));
            setError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validation
        if (!formData.title || !formData.departmentId || !formData.semesterId || !formData.file) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            setUploadProgress(0);

            const uploadData = new FormData();
            uploadData.append('title', formData.title);
            uploadData.append('description', formData.description);
            uploadData.append('departmentId', formData.departmentId);
            uploadData.append('semesterId', formData.semesterId);
            uploadData.append('file', formData.file);

            await documentAPI.upload(uploadData, (progressEvent) => {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(progress);
            });

            setSuccess(true);
            setFormData({
                title: '',
                description: '',
                departmentId: '',
                semesterId: '',
                file: null
            });

            // Reset file input
            document.getElementById('file-input').value = '';

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/documents');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to upload document');
            console.error('Upload error:', err);
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="container">
            <div style={pageContainerStyle}>
                <h1 style={titleStyle}>📤 Upload Document</h1>

                {error && <div className="alert alert-error">{error}</div>}
                {success && (
                    <div className="alert alert-success">
                        Document uploaded successfully! Redirecting to documents page...
                    </div>
                )}

                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Title *</label>
                            <input
                                type="text"
                                name="title"
                                className="form-input"
                                placeholder="e.g., Data Structures PYQ 2023"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                className="form-textarea"
                                placeholder="Optional description about the document..."
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div style={gridStyle}>
                            <div className="form-group">
                                <label className="form-label">Department *</label>
                                <select
                                    name="departmentId"
                                    className="form-select"
                                    value={formData.departmentId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name} ({dept.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Semester *</label>
                                <select
                                    name="semesterId"
                                    className="form-select"
                                    value={formData.semesterId}
                                    onChange={handleInputChange}
                                    disabled={!formData.departmentId}
                                    required
                                >
                                    <option value="">Select Semester</option>
                                    {semesters.map((sem) => (
                                        <option key={sem.id} value={sem.id}>
                                            Semester {sem.semester_number}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">File * (Max 100MB)</label>
                            <input
                                id="file-input"
                                type="file"
                                className="form-input"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                                required
                            />
                            {formData.file && (
                                <p style={fileInfoStyle}>
                                    Selected: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                            )}
                        </div>

                        {loading && uploadProgress > 0 && (
                            <div style={progressContainerStyle}>
                                <div style={progressBarStyle}>
                                    <div style={{ ...progressFillStyle, width: `${uploadProgress}%` }} />
                                </div>
                                <p style={progressTextStyle}>{uploadProgress}% uploaded</p>
                            </div>
                        )}

                        <div style={buttonGroupStyle}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Uploading...' : '📤 Upload Document'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/documents')}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

const pageContainerStyle = {
    maxWidth: '800px',
    margin: '0 auto'
};

const titleStyle = {
    fontSize: 'var(--text-3xl)',
    marginBottom: 'var(--spacing-lg)',
    color: 'var(--text-primary)'
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 'var(--spacing-lg)'
};

const fileInfoStyle = {
    marginTop: 'var(--spacing-sm)',
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)'
};

const progressContainerStyle = {
    marginBottom: 'var(--spacing-lg)'
};

const progressBarStyle = {
    width: '100%',
    height: '8px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden'
};

const progressFillStyle = {
    height: '100%',
    backgroundColor: 'var(--primary)',
    transition: 'width 0.3s ease'
};

const progressTextStyle = {
    marginTop: 'var(--spacing-sm)',
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
    textAlign: 'center'
};

const buttonGroupStyle = {
    display: 'flex',
    gap: 'var(--spacing-md)'
};
