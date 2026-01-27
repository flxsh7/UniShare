import { useState, useEffect } from 'react';
import { departmentAPI } from '../services/api';

export default function AdminPage() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const [newDepartment, setNewDepartment] = useState({
        name: '',
        code: ''
    });

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            setLoading(true);
            const response = await departmentAPI.getAll();
            setDepartments(response.data.data);
        } catch (err) {
            setError('Failed to load departments');
            console.error('Error loading departments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddDepartment = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!newDepartment.name || !newDepartment.code) {
            setError('Please fill in all fields');
            return;
        }

        try {
            await departmentAPI.create(newDepartment);
            setSuccess('Department added successfully!');
            setNewDepartment({ name: '', code: '' });
            setShowAddForm(false);
            loadDepartments();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add department');
            console.error('Error adding department:', err);
        }
    };

    const handleDeleteDepartment = async (id, name) => {
        if (!confirm(`Are you sure you want to delete ${name}? This will also delete all associated documents.`)) {
            return;
        }

        try {
            await departmentAPI.delete(id);
            setSuccess('Department deleted successfully!');
            loadDepartments();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete department');
            console.error('Error deleting department:', err);
        }
    };

    return (
        <div className="container">
            <h1 style={titleStyle}>⚙️ Admin Dashboard</h1>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Add Department Section */}
            <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={headerStyle}>
                    <h2 style={sectionTitleStyle}>Manage Departments</h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        {showAddForm ? '✖ Cancel' : '➕ Add Department'}
                    </button>
                </div>

                {showAddForm && (
                    <form onSubmit={handleAddDepartment} style={formStyle}>
                        <div style={formGridStyle}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Department Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., Computer Science and Engineering"
                                    value={newDepartment.name}
                                    onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Department Code</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., CSE"
                                    value={newDepartment.code}
                                    onChange={(e) => setNewDepartment({ ...newDepartment, code: e.target.value.toUpperCase() })}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--spacing-md)' }}>
                            Add Department
                        </button>
                    </form>
                )}
            </div>

            {/* Departments List */}
            <div className="card">
                <h2 style={sectionTitleStyle}>Existing Departments</h2>

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : departments.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No departments found.</p>
                ) : (
                    <div style={tableContainerStyle}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Name</th>
                                    <th style={thStyle}>Code</th>
                                    <th style={thStyle}>Created</th>
                                    <th style={thStyle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departments.map((dept) => (
                                    <tr key={dept.id} style={trStyle}>
                                        <td style={tdStyle}>{dept.name}</td>
                                        <td style={tdStyle}>
                                            <span style={codeStyle}>{dept.code}</span>
                                        </td>
                                        <td style={tdStyle}>
                                            {new Date(dept.created_at).toLocaleDateString()}
                                        </td>
                                        <td style={tdStyle}>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                                                style={{ padding: '0.25rem 0.75rem', fontSize: 'var(--text-sm)' }}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="card" style={{ marginTop: 'var(--spacing-xl)', backgroundColor: '#eff6ff' }}>
                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>ℹ️ Admin Information</h3>
                <ul style={{ paddingLeft: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>
                    <li>Adding a department automatically creates 8 semesters for it</li>
                    <li>Deleting a department will also delete all associated documents</li>
                    <li>Only users with admin role can access this page</li>
                </ul>
            </div>
        </div>
    );
}

const titleStyle = {
    fontSize: 'var(--text-3xl)',
    marginBottom: 'var(--spacing-lg)',
    color: 'var(--text-primary)'
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--spacing-lg)'
};

const sectionTitleStyle = {
    fontSize: 'var(--text-xl)',
    color: 'var(--text-primary)',
    marginBottom: 'var(--spacing-md)'
};

const formStyle = {
    marginTop: 'var(--spacing-lg)',
    padding: 'var(--spacing-lg)',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)'
};

const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 'var(--spacing-lg)'
};

const tableContainerStyle = {
    overflowX: 'auto'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
};

const thStyle = {
    textAlign: 'left',
    padding: 'var(--spacing-md)',
    borderBottom: '2px solid var(--border)',
    fontWeight: '600',
    color: 'var(--text-primary)'
};

const tdStyle = {
    padding: 'var(--spacing-md)',
    borderBottom: '1px solid var(--border)'
};

const trStyle = {
    transition: 'background-color 0.2s'
};

const codeStyle = {
    backgroundColor: 'var(--bg-tertiary)',
    padding: '0.25rem 0.5rem',
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'monospace',
    fontWeight: '600'
};
