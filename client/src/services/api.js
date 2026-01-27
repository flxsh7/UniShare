import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Store the getToken function
let getTokenFunction = null;

// Set the getToken function from Clerk
export const setGetTokenFunction = (getTokenFn) => {
    getTokenFunction = getTokenFn;
};

// Add request interceptor to attach token to every request
api.interceptors.request.use(
    async (config) => {
        if (getTokenFunction) {
            try {
                const token = await getTokenFunction();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Error getting token:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Department API
export const departmentAPI = {
    getAll: () => api.get('/departments'),
    getSemesters: (departmentId) => api.get(`/departments/${departmentId}/semesters`),
    create: (data) => api.post('/departments', data),
    delete: (id) => api.delete(`/departments/${id}`)
};

// Document API
export const documentAPI = {
    getAll: (params) => api.get('/documents', { params }),
    getById: (id) => api.get(`/documents/${id}`),
    upload: (formData, onUploadProgress) => {
        return api.post('/documents/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress
        });
    },
    incrementDownload: (id) => api.post(`/documents/${id}/download`),
    delete: (id) => api.delete(`/documents/${id}`)
};

export default api;
