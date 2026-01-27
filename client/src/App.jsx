import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { setGetTokenFunction } from './services/api';
import HomePage from './pages/HomePage';
import DocumentsPage from './pages/DocumentsPage';
import UploadPage from './pages/UploadPage';
import AdminPage from './pages/AdminPage';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Clerk Publishable Key');
}

// Layout component with navigation
function Layout({ children }) {
    const { getToken } = useAuth();

    // Set the getToken function for API calls
    useEffect(() => {
        setGetTokenFunction(getToken);
    }, [getToken]);

    return (
        <div>
            <nav style={navStyle}>
                <div className="container" style={navContainerStyle}>
                    <Link to="/" style={logoStyle}>
                        📚 UniShare
                    </Link>
                    <div style={navLinksStyle}>
                        <SignedIn>
                            <Link to="/documents" style={linkStyle}>Documents</Link>
                            <Link to="/upload" style={linkStyle}>Upload</Link>
                            <Link to="/admin" style={linkStyle}>Admin</Link>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </div>
                </div>
            </nav>
            <main style={mainStyle}>
                {children}
            </main>
        </div>
    );
}

// Protected route component
function ProtectedRoute({ children }) {
    return (
        <>
            <SignedIn>{children}</SignedIn>
            <SignedOut>
                <Navigate to="/" replace />
            </SignedOut>
        </>
    );
}

function App() {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route
                            path="/documents"
                            element={
                                <ProtectedRoute>
                                    <DocumentsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/upload"
                            element={
                                <ProtectedRoute>
                                    <UploadPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <AdminPage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </ClerkProvider>
    );
}

// Inline styles for navigation
const navStyle = {
    backgroundColor: 'var(--bg-primary)',
    borderBottom: '1px solid var(--border)',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px var(--shadow)'
};

const navContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const logoStyle = {
    fontSize: 'var(--text-xl)',
    fontWeight: 'bold',
    color: 'var(--primary)',
    textDecoration: 'none'
};

const navLinksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-lg)'
};

const linkStyle = {
    color: 'var(--text-primary)',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'color 0.2s'
};

const mainStyle = {
    minHeight: 'calc(100vh - 80px)',
    padding: '2rem 0'
};

export default App;
