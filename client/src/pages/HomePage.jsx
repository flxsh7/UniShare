import { SignIn, SignUp, SignedIn, SignedOut } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function HomePage() {
    const navigate = useNavigate();

    // Redirect to documents if already signed in
    useEffect(() => {
        const checkAuth = async () => {
            setTimeout(() => {
                const signedIn = document.querySelector('[data-clerk-signed-in]');
                if (signedIn) {
                    navigate('/documents');
                }
            }, 100);
        };
        checkAuth();
    }, [navigate]);

    return (
        <div className="container">
            <SignedOut>
                <div style={heroStyle}>
                    <h1 style={titleStyle}>📚 Welcome to UniShare</h1>
                    <p style={subtitleStyle}>
                        Your university's document sharing platform for PYQs, notes, syllabus, and more.
                    </p>

                    <div style={authContainerStyle}>
                        <div style={authBoxStyle}>
                            <h2 style={authTitleStyle}>Sign In</h2>
                            <SignIn
                                afterSignInUrl="/documents"
                            />
                        </div>

                        <div style={authBoxStyle}>
                            <h2 style={authTitleStyle}>Sign Up</h2>
                            <SignUp
                                afterSignUpUrl="/documents"
                            />
                        </div>
                    </div>

                    <div style={featuresStyle}>
                        <div style={featureCardStyle}>
                            <h3>📤 Upload Documents</h3>
                            <p>Share your notes, PYQs, and study materials with fellow students</p>
                        </div>
                        <div style={featureCardStyle}>
                            <h3>🔍 Easy Search</h3>
                            <p>Find documents by department, semester, or keywords</p>
                        </div>
                        <div style={featureCardStyle}>
                            <h3>📥 Quick Download</h3>
                            <p>Access all documents instantly with one click</p>
                        </div>
                    </div>
                </div>
            </SignedOut>

            <SignedIn>
                <div style={heroStyle}>
                    <h1 style={titleStyle}>Welcome back! 👋</h1>
                    <p style={subtitleStyle}>Redirecting to documents...</p>
                </div>
            </SignedIn>
        </div>
    );
}

const heroStyle = {
    textAlign: 'center',
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem 0'
};

const titleStyle = {
    fontSize: 'var(--text-3xl)',
    fontWeight: 'bold',
    marginBottom: 'var(--spacing-md)',
    color: 'var(--text-primary)'
};

const subtitleStyle = {
    fontSize: 'var(--text-lg)',
    color: 'var(--text-secondary)',
    marginBottom: 'var(--spacing-xl)'
};

const authContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'var(--spacing-xl)',
    marginTop: 'var(--spacing-xl)',
    marginBottom: 'var(--spacing-xl)'
};

const authBoxStyle = {
    backgroundColor: 'var(--bg-primary)',
    padding: 'var(--spacing-xl)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: '0 4px 6px var(--shadow)'
};

const authTitleStyle = {
    fontSize: 'var(--text-xl)',
    marginBottom: 'var(--spacing-lg)',
    color: 'var(--text-primary)'
};

const featuresStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 'var(--spacing-lg)',
    marginTop: 'var(--spacing-xl)'
};

const featureCardStyle = {
    backgroundColor: 'var(--bg-primary)',
    padding: 'var(--spacing-lg)',
    borderRadius: 'var(--radius-lg)',
    textAlign: 'center',
    boxShadow: '0 2px 4px var(--shadow)'
};
